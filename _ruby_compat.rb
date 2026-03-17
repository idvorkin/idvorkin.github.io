# Monkey-patch for Ruby 3.2+ compatibility with old github-pages gems
# tainted?/taint/untaint were removed in Ruby 3.2
unless Object.method_defined?(:tainted?)
  class Object
    def tainted?; false; end
    def taint; self; end
    def untaint; self; end
  end
end

# Ruby 4.0+ compatibility: pathutil 0.16.2 passes Hash as positional arg
# to IO.read/binread/readlines/write/binwrite, but Ruby 4.0 removed
# the implicit Hash-to-kwargs conversion.
if RUBY_VERSION >= '4.0'
  module PathutilRuby4Fix
    def read(*args, **kwd)
      kwd[:encoding] ||= encoding
      if normalize[:read]
        File.read(self.to_s, *args, **kwd).encode(universal_newline: true)
      else
        File.read(self.to_s, *args, **kwd)
      end
    end

    def binread(*args, **kwd)
      kwd[:encoding] ||= encoding
      if normalize[:binread]
        File.binread(self.to_s, *args, **kwd).encode(universal_newline: true)
      else
        File.binread(self.to_s, *args, **kwd)
      end
    end

    def readlines(*args, **kwd)
      kwd[:encoding] ||= encoding
      if normalize[:read]
        File.readlines(self.to_s, *args, **kwd).encode(universal_newline: true)
      else
        File.readlines(self.to_s, *args, **kwd)
      end
    end

    def write(data, *args, **kwd)
      kwd[:encoding] ||= encoding
      if normalize[:write]
        File.write(self.to_s, data.encode(crlf_newline: true), *args, **kwd)
      else
        File.write(self.to_s, data, *args, **kwd)
      end
    end

    def binwrite(data, *args, **kwd)
      kwd[:encoding] ||= encoding
      if normalize[:write]
        File.binwrite(self.to_s, data.encode(crlf_newline: true), *args, **kwd)
      else
        File.binwrite(self.to_s, data, *args, **kwd)
      end
    end
  end

  # Apply patch lazily after pathutil is loaded (this file runs via RUBYOPT
  # before bundler sets up gem paths, so pathutil isn't available yet)
  TracePoint.new(:end) do |tp|
    if tp.self.name == 'Pathutil' && !tp.self.ancestors.include?(PathutilRuby4Fix)
      tp.self.prepend(PathutilRuby4Fix)
    end
  end.enable
end
