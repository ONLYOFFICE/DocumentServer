task :default do
  sh "compass compile"
end

task :pages do
  require 'git'
  require 'fileutils'
  repo = Git.open('.')

  #  copy tests into a temp dir before switching branch
  FileUtils.rm_rf "tmp"
  FileUtils.mkdir("tmp")
  (FileList.new('tests/**/*.html')+FileList.new('tests/**/*.css')).each do |file|
    FileUtils.mkdir_p(File.dirname("tmp/#{file[6..-1]}"))
    FileUtils.cp(file, "tmp/#{file[6..-1]}")
  end

  # switch branch
  repo.branch("gh-pages").checkout

  # Prepare gh-pages
  FileUtils.rm_rf "recipes/*"
  htmlHeader = File.open("layout/header.html", "r").read
  htmlFooter = File.open("layout/footer.html", "r").read

  # HTML files need header and footer
  FileList.new('tmp/**/*.html').each do |file|
    FileUtils.mkdir_p(File.dirname("#{file[4..-1]}"))
    htmlfile = File.open("#{file[4..-1]}", "w")
    contents = File.open(file, "rb").read
    htmlfile.write(htmlHeader+contents+htmlFooter)
    htmlfile.close
  end

  # CSS: just copy
  FileList.new('tmp/**/*.css').each do |file|
    FileUtils.mkdir_p(File.dirname("#{file[4..-1]}"))
    FileUtils.cp(file, "#{file[4..-1]}")
  end

  FileUtils.rm_rf("tmp")

  # Commit gh-pages changes
  # @todo make this optional ?
  Dir["recipes/**/*"].each {|f| repo.add(f) }
  repo.status.deleted.each {|f, s| repo.remove(f)}
  message = ENV["MESSAGE"] || "Updated at #{Time.now.utc}"
  repo.commit(message)

  # back to master (maybe it's not appropriate if we are not working on master ?!)
  repo.branch("master").checkout
end