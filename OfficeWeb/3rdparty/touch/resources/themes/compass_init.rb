# This file registers the sencha-touch framework with compass
# It's a magic name that compass knows how to find.
dir = File.dirname(__FILE__)
require File.join(dir, 'lib', 'theme_images.rb')

# Include compass-recipes
require File.join(File.dirname(__FILE__), 'vendor', 'compass-recipes', 'config')

Compass::BrowserSupport.add_support('repeating-linear-gradient', 'webkit', 'moz', 'o', 'ms')
Compass::Frameworks.register 'sencha-touch', dir
