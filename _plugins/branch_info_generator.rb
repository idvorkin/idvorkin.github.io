Jekyll::Hooks.register :site, :post_write do |site|
  # Only generate branch info for development environments
  if site.config['url'] == 'http://localhost:4000' || Jekyll.env == 'development'
    branch = `git rev-parse --abbrev-ref HEAD`.strip rescue 'unknown'
    
    branch_info = {
      'branch' => branch,
      'generated_at' => Time.now.to_s
    }
    
    File.open(File.join(site.dest, 'branch-info.json'), 'w') do |f|
      f.write(JSON.pretty_generate(branch_info))
    end
  end
end