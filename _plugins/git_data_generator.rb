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

          # Read PR data from YAML file
          pr_file = File.join(site.source, '_data', 'current_pr.yml')
          if File.exist?(pr_file)
            begin
              require 'yaml'
              pr_data = YAML.safe_load_file(pr_file)
              if pr_data && pr_data.is_a?(Hash) && pr_data['branch'] == branch
                pr_number = pr_data['pr_number']
                # Validate PR number is a positive integer within reasonable range
                unless pr_number.is_a?(Integer) && pr_number > 0 && pr_number < 1_000_000
                  Jekyll.logger.warn "Git data:", "Invalid PR number: #{pr_number}"
                  pr_number = nil
                end
              end
            rescue => e
              Jekyll.logger.warn "Git data:", "Failed to read PR file: #{e.message}"
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