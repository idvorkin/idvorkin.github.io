file = ''
ARGV.each do|a|
    file = a
end
contents = ''

open(file, 'r') { |f| contents <<  f.read() } 
open(file+'.backup', 'w') { |f| f << contents } 
contents.encode!('UTF-8', 'binary', invalid: :replace, undef: :replace, replace: '')

open(file, 'w') { |f| f << contents } 
