REM From - https://tibel.github.io/posts/jekyll-3.0.x-portable/ 
REM 1st time follow directions to setup ruby into \jekyll
REM gem install activesupport github-pages wdm
REM
@ECHO OFF
ECHO Adding Jekyll to PATH...
SET RUBY_PATH=c:\jekyll\ruby
SET DEVKIT_PATH=c:\jekyll\devkit
SET PATH=%RUBY_PATH%\bin;%DEVKIT_PATH%\bin;%DEVKIT_PATH%\mingw\bin;%PATH%

