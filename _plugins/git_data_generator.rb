module Jekyll
  class GitDataGenerator < Generator
    safe true
    priority :highest

    def generate(site)
      Jekyll.logger.info "Git data:", "Plugin starting..."
      # Get current git branch
      branch = 'unknown'
      begin
        # Change to site source directory to ensure git command runs in correct location
        Dir.chdir(site.source) do
          branch = `git rev-parse --abbrev-ref HEAD 2>/dev/null`.strip
          branch = 'unknown' if branch.empty? || branch.include?('fatal')
        end
      rescue => e
        Jekyll.logger.warn "Git data:", "Failed to get branch: #{e.message}"
      end
      
      # Create git data
      site.data['git'] = {
        'branch' => branch,
        'generated_at' => Time.now.to_s
      }
      
      Jekyll.logger.info "Git data:", "Branch: #{branch} (from #{site.source})"
    end
  end
end