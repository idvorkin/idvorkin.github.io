//! A minimal safe wrapper over PCRE2 (pcre2-sys, the bundled C library).
//!
//! Why not the pcre2 crate: it matches every subject with a UTF-8 check,
//! which runs from the start offset to the end on every call, so a scan
//! that matches k times through an n-byte page costs O(k * n). Subjects
//! here are &str, valid UTF-8 by construction, so matching with
//! PCRE2_NO_UTF_CHECK is sound (callers pass start offsets on char
//! boundaries, which pyre.rs guarantees).

use pcre2_sys::*;
use std::ptr::null_mut;
use std::sync::Mutex;

struct Data {
    md: *mut pcre2_match_data_8,
    mctx: *mut pcre2_match_context_8,
    stack: *mut pcre2_jit_stack_8,
}

pub struct Code {
    code: *mut pcre2_code_8,
    pattern: String,
    // One match buffer per pattern; a build converts on one thread per
    // process, so the lock is never contended.
    data: Mutex<Data>,
}

// SAFETY: the compiled code is read-only after compile and safe to share;
// the match data and JIT stack are only touched under the mutex.
unsafe impl Send for Code {}
unsafe impl Sync for Code {}

fn message(rc: i32) -> String {
    let mut buf = [0u8; 256];
    // SAFETY: buf is writable and its length is passed.
    let n = unsafe { pcre2_get_error_message_8(rc, buf.as_mut_ptr(), buf.len()) };
    if n < 0 {
        format!("PCRE2 error {rc}")
    } else {
        String::from_utf8_lossy(&buf[..n as usize]).into_owned()
    }
}

impl Code {
    pub fn new(pattern: &str) -> Result<Code, String> {
        let (mut err, mut off) = (0i32, 0usize);
        // SAFETY: pattern is valid for its length; the out-params are ours.
        let code = unsafe {
            pcre2_compile_8(
                pattern.as_ptr(),
                pattern.len(),
                PCRE2_UTF,
                &mut err,
                &mut off,
                null_mut(),
            )
        };
        if code.is_null() {
            return Err(format!("{} at offset {off}", message(err)));
        }
        // SAFETY: code is a live compiled pattern. A JIT failure leaves the
        // interpreter, which pcre2_match falls back to with the same result.
        unsafe {
            pcre2_jit_compile_8(code, PCRE2_JIT_COMPLETE);
            let md = pcre2_match_data_create_from_pattern_8(code, null_mut());
            let mctx = pcre2_match_context_create_8(null_mut());
            let stack = pcre2_jit_stack_create_8(32 << 10, 64 << 20, null_mut());
            assert!(
                !md.is_null() && !mctx.is_null() && !stack.is_null(),
                "PCRE2: out of memory"
            );
            pcre2_jit_stack_assign_8(mctx, None, stack.cast());
            Ok(Code {
                code,
                pattern: pattern.to_string(),
                data: Mutex::new(Data { md, mctx, stack }),
            })
        }
    }

    pub fn pattern(&self) -> &str {
        &self.pattern
    }

    /// Search s from byte offset start. On a match, out holds every group's
    /// span (None for a group that did not take part).
    pub fn exec(
        &self,
        s: &str,
        start: usize,
        out: &mut Vec<Option<(usize, usize)>>,
    ) -> Result<bool, String> {
        assert!(
            start <= s.len() && s.is_char_boundary(start),
            "PCRE2: start {start} off a char boundary"
        );
        let d = self.data.lock().unwrap_or_else(|e| e.into_inner());
        // An empty subject still needs a dereferenceable pointer.
        let ptr = if s.is_empty() {
            c"".as_ptr().cast()
        } else {
            s.as_ptr()
        };
        // SAFETY: s is valid UTF-8 (a &str) and start is on a char
        // boundary, which is all PCRE2_NO_UTF_CHECK asks; md/mctx are ours.
        let rc = unsafe {
            pcre2_match_8(
                self.code,
                ptr,
                s.len(),
                start,
                PCRE2_NO_UTF_CHECK,
                d.md,
                d.mctx,
            )
        };
        if rc == PCRE2_ERROR_NOMATCH {
            return Ok(false);
        }
        if rc <= 0 {
            return Err(message(rc));
        }
        out.clear();
        // SAFETY: md holds the ovector of the match that just succeeded,
        // sized for the pattern's groups (create_from_pattern).
        unsafe {
            let n = pcre2_get_ovector_count_8(d.md) as usize;
            let ov = pcre2_get_ovector_pointer_8(d.md);
            for i in 0..n {
                let (a, b) = (*ov.add(2 * i), *ov.add(2 * i + 1));
                out.push(if a == PCRE2_UNSET { None } else { Some((a, b)) });
            }
        }
        Ok(true)
    }
}

impl Drop for Code {
    fn drop(&mut self) {
        let d = self.data.get_mut().unwrap_or_else(|e| e.into_inner());
        // SAFETY: each pointer was created in new() and is freed once.
        unsafe {
            pcre2_match_data_free_8(d.md);
            pcre2_match_context_free_8(d.mctx);
            pcre2_jit_stack_free_8(d.stack);
            pcre2_code_free_8(self.code);
        }
    }
}
