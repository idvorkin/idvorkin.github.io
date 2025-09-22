module Jekyll
  class GitDataGenerator < Generator
    safe true
    priority :highest

    def generate(site)
      Jekyll.logger.info "Git data:", "Plugin starting..."
      # Get current git branch
      branch = 'unknown'
      pr_number = nil
      begin
        # Change to site source directory to ensure git command runs in correct location
        Dir.chdir(site.source) do
          branch = `git rev-parse --abbrev-ref HEAD 2>/dev/null`.strip
          branch = 'unknown' if branch.empty? || branch.include?('fatal')
          
          # Get PR number for current branch if it exists
          if branch != 'unknown' && branch != 'main'
            pr_output = `gh pr view --json number 2>/dev/null`.strip
            unless pr_output.empty? || pr_output.include?('no pull requests found')
              require 'json'
              begin
                pr_data = JSON.parse(pr_output)
                pr_number = pr_data['number']
              rescue JSON::ParserError => e
                Jekyll.logger.warn "Git data:", "Failed to parse PR JSON: #{e.message}"
              end
            end
          end
        end
      rescue => e
        Jekyll.logger.warn "Git data:", "Failed to get git info: #{e.message}"
      end
      
      # Create git data
      site.data['git'] = {
        'branch' => branch,
        'pr_number' => pr_number,
        'generated_at' => Time.now.to_s
      }
      
      Jekyll.logger.info "Git data:", "Branch: #{branch}, PR: #{pr_number || 'none'} (from #{site.source})"
    end
  end
end