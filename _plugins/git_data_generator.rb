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

          Jekyll.logger.info "Git data:", "Detected branch: '#{branch}' (type: #{branch.class})"

          # Auto-detect PR number using gh CLI
          if branch != 'unknown' && branch != 'main' && branch != 'master'
            begin
              # Find gh command - check PATH first, then common install locations
              gh_cmd = `which gh 2>/dev/null`.strip
              if gh_cmd.empty?
                # Check common installation paths
                [
                  '/opt/homebrew/bin/gh',        # Mac M1/M2 Homebrew
                  '/usr/local/bin/gh',           # Mac Intel Homebrew
                  '/home/linuxbrew/.linuxbrew/bin/gh'  # Linux Homebrew
                ].each do |path|
                  if File.exist?(path)
                    gh_cmd = path
                    break
                  end
                end
              end

              Jekyll.logger.info "Git data:", "Attempting to detect PR for branch '#{branch}'"

              if !gh_cmd.empty? && File.exist?(gh_cmd)
                pr_output = `#{gh_cmd} pr list --head #{branch} --json number --jq '.[0].number' 2>&1`.strip
                Jekyll.logger.info "Git data:", "gh output: '#{pr_output}'"

                if !pr_output.empty? && pr_output != 'null' && !pr_output.include?('error') && !pr_output.include?('fatal')
                  pr_number = pr_output.to_i
                  Jekyll.logger.info "Git data:", "Parsed PR number: #{pr_number}"

                  # Validate PR number is a positive integer within reasonable range
                  unless pr_number > 0 && pr_number < 1_000_000
                    Jekyll.logger.warn "Git data:", "Invalid PR number detected: #{pr_number}"
                    pr_number = nil
                  end
                else
                  Jekyll.logger.info "Git data:", "No valid PR number in output"
                end
              else
                Jekyll.logger.warn "Git data:", "gh command not found at #{gh_cmd}"
              end
            rescue => e
              Jekyll.logger.warn "Git data:", "Failed to detect PR via gh: #{e.message}"
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