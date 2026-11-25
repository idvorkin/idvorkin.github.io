// A Python extension leaves Python's symbols for the interpreter to provide;
// macOS's linker needs to be told so (-undefined dynamic_lookup).
fn main() {
    pyo3_build_config::add_extension_module_link_args();
}
