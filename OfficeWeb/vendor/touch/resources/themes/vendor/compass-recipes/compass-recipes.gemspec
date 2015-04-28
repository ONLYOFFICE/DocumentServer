# -*- encoding: utf-8 -*-

Gem::Specification.new do |gemspec|
  gemspec.version = File.read(File.dirname(__FILE__) + '/VERSION').strip
  gemspec.date = Date.today

  gemspec.name = "compass-recipes"
  gemspec.authors = ["Maxime Thirouin", "David Kaneda"]
  gemspec.summary = %q{Recipes for Compass}
  gemspec.description = %q{A Compass extension to have some sass/compass recipes ready to use ! }
  gemspec.email = "maxime.thirouin@gmail.com"
  gemspec.homepage = "http://moox.github.com/compass-recipes"

  gemspec.rubyforge_project = "compass-recipes"

  gemspec.has_rdoc = false
  gemspec.require_paths = %w(lib)
  gemspec.rubygems_version = "1.3.5" # same as compass

  gemspec.files = %w(README.md LICENSE VERSION)
  gemspec.files += Dir.glob("fonts/**/*.*")
  gemspec.files += Dir.glob("lib/**/*.*")
  gemspec.files += Dir.glob("stylesheets/**/*.*")

  gemspec.add_dependency("compass", [">= 0.11.7"]) # latest version of compass
end
