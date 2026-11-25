//! zola/convert.py's kramdown -> CommonMark fixes, in Rust. convert.py loads
//! this as a Python extension (zola/rustconvert.py) unless CONVERT_PY=1.
//! Each function ports the Python one it names, to the byte; the Python
//! stays the reference, and a call that panics here (an unexpected shape,
//! a regex past its backtrack limit) raises RuntimeError so the caller
//! redoes it in Python.

mod fix;
mod lists;
mod pcre;
mod pyre;
mod typography;

use pyo3::exceptions::PyRuntimeError;
use pyo3::prelude::*;
use std::panic::{catch_unwind, AssertUnwindSafe};

fn guard<T>(f: impl FnOnce() -> T) -> PyResult<T> {
    catch_unwind(AssertUnwindSafe(f)).map_err(|e| {
        let msg = e
            .downcast_ref::<String>()
            .cloned()
            .or_else(|| e.downcast_ref::<&str>().map(|s| s.to_string()))
            .unwrap_or_else(|| "panic".into());
        PyRuntimeError::new_err(format!("tools/convert: {msg}"))
    })
}

/// typography.apply
#[pyfunction]
fn typography_apply(py: Python<'_>, md: &str) -> PyResult<String> {
    py.detach(|| guard(|| typography::apply(md)))
}

type IncIn = (String, String, bool, bool);
type FixOut = (String, Vec<String>, Vec<(String, Py<PyAny>)>);

/// convert.fix_markdown_py: (body, base, [(raw, text, inline, markdown)])
/// -> (body, [include text], [(note, value)] in insertion order).
#[pyfunction]
fn fix_markdown(py: Python<'_>, body: &str, base: &str, incs: Vec<IncIn>) -> PyResult<FixOut> {
    let (out, texts, notes) = py.detach(|| {
        guard(|| {
            let mut incs: Vec<fix::Inc> = incs
                .into_iter()
                .map(|(raw, text, inline, markdown)| fix::Inc {
                    raw,
                    text,
                    inline,
                    markdown,
                })
                .collect();
            let mut notes = fix::Notes::default();
            let out = fix::fix_markdown(body, base, &mut incs, &mut notes);
            (
                out,
                incs.into_iter().map(|i| i.text).collect::<Vec<_>>(),
                notes,
            )
        })
    })?;
    let mut ops = vec![];
    for (k, v) in notes.0 {
        let obj = match v {
            fix::Note::N(n) => n.into_pyobject(py)?.into_any().unbind(),
            fix::Note::List(l) => l.into_pyobject(py)?.into_any().unbind(),
        };
        ops.push((k, obj));
    }
    Ok((out, texts, ops))
}

#[pymodule]
fn zolaconvert(m: &Bound<'_, PyModule>) -> PyResult<()> {
    // The message rides in the RuntimeError (and the page's report); keep
    // the default hook from also printing every fallback.
    std::panic::set_hook(Box::new(|_| {}));
    m.add_function(wrap_pyfunction!(typography_apply, m)?)?;
    m.add_function(wrap_pyfunction!(fix_markdown, m)?)?;
    Ok(())
}
