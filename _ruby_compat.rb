# Monkey-patch for Ruby 3.2+ compatibility with old github-pages gems
# tainted?/taint/untaint were removed in Ruby 3.2
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?; false; end
    def taint; self; end
    def untaint; self; end
  end
end
