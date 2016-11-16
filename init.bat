REM From - https://tibel.github.io/posts/jekyll-3.0.x-portable/ 
REM 1st time follow directions to setup ruby into \jekyll
REM
@ECHO OFF


ECHO Adding Jekyll to PATH...
SET RUBY_PATH=c:\jekyll\ruby
SET DEVKIT_PATH=c:\jekyll\devkit
SET PATH=%RUBY_PATH%\bin;%DEVKIT_PATH%\bin;%DEVKIT_PATH%\mingw\bin;%PATH%
goto :eof

REM First time setup
:first_time_setup
goto :eof
REM GRAH WHAT A MESS.
REM  Just use the binaries @ OneDrive\jekyll.bat
REM GRAH WHAT A MESS.
wget -nc http://dl.bintray.com/oneclick/rubyinstaller/ruby-2.1.7-i386-mingw32.7z
echo Write dekvit to \jekyll\ruby-blah
wget -nc http://dl.bintray.com/oneclick/rubyinstaller/DevKit-mingw64-32-4.7.2-20130224-1151-sfx.exe
echo Write dekvit to \jekyll\devkit

wget -nc https://raw.githubusercontent.com/rubygems/rubygems/master/lib/rubygems/ssl_certs/rubygems.org/AddTrustExternalCARoot.pem

echo copy into old cert location.
#git sources --remove https://rubygems.org
#git sources -a https://rubygems.org
copy AddTrustExternalCARoot.pem C:\jekyll\ruby\lib\ruby\2.1.0\rubygems\ssl_certs

gem install activesupport github-pages wdm jekyll


:goto eof


