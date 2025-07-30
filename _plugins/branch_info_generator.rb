require 'json'

Jekyll::Hooks.register :site, :post_write do |site|
  # Generate branch info for all local development
  if site.config['serving'] || Jekyll.env == 'development'
    begin
      branch = `git rev-parse --abbrev-ref HEAD`.strip
      branch = 'unknown' if branch.empty?
      
      branch_info = {
        'branch' => branch,
        'generated_at' => Time.now.to_s
      }
      
      output_path = File.join(site.dest, 'branch-info.json')
      File.open(output_path, 'w') do |f|
        f.write(JSON.pretty_generate(branch_info))
      end
      
      Jekyll.logger.info "Branch info:", "Generated #{output_path} with branch: #{branch}"
    rescue => e
      Jekyll.logger.error "Branch info:", "Failed to generate: #{e.message}"
    end
  end
end