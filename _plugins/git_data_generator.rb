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
      base, changed = changed_sources(site.source, branch)
      add_diff_base_pages(site, base, changed)
      site.data['git'] = {
        'branch' => branch,
        'pr_number' => pr_number,
        'changed_pages' => changed.map(&:last),
        'generated_at' => Time.now.to_s
      }

      Jekyll.logger.info "Git data:", "Branch: #{branch}, PR: #{pr_number || 'none'} (from #{site.source})"
    end

    # The merge-base with the canonical main (upstream/main in a fork checkout, else origin/main),
    # and [file, permalink] for each post this branch changes, so the dev banner can link to them.
    def changed_sources(source, branch)
      return [nil, []] if %w[unknown main master].include?(branch)
      Dir.chdir(source) do
        base = %w[upstream/main origin/main].map { |ref| `git merge-base HEAD #{ref} 2>/dev/null`.strip }.find { |sha| !sha.empty? }
        files = base ? `git diff --name-only #{base} -- _d _posts _td`.split("\n") : []
        files += `git ls-files -m -o --exclude-standard -- _d _posts _td`.split("\n")
        [base, files.uniq.sort.filter_map do |f|
          permalink = File.file?(f) && File.foreach(f).first(40).join[/^permalink:\s*(\/\S*)/, 1]
          [f, permalink] if permalink
        end]
      end
    rescue => e
      Jekyll.logger.warn "Git data:", "Failed to list changed pages: #{e.message}"
      [nil, []]
    end

    DIFF_BASE = '/_diff-base'

    # Dev-only: render main's copy of each changed page at /_diff-base/<permalink>, so the preview's
    # "Diff vs main" (src/rich-diff.ts) reads its base SAME-ORIGIN instead of fetching idvork.in.
    # Only branch builds reach here (main/master return no changed pages), so production never gets these.
    # A page absent on main gets no copy: its 404 renders as "new page".
    def add_diff_base_pages(site, base, changed)
      return unless base
      changed.each do |file, permalink|
        raw = IO.popen(['git', '-C', site.source, 'show', "#{base}:#{file}"], err: File::NULL, &:read).force_encoding('UTF-8')
        next unless $?.success?
        m = raw.match(Jekyll::Document::YAML_FRONT_MATTER_REGEXP)
        data = m ? (SafeYAML.load(m[1]) || {}) : {}
        page = PageWithoutAFile.new(site, site.source, '', "index#{File.extname(file)}")
        page.content = m ? m.post_match : raw
        # redirect_from would make jekyll-redirect-from shadow the real page's redirects.
        page.data.merge!(data.reject { |k, _| k == 'redirect_from' })
        page.data['permalink'] = DIFF_BASE + permalink.sub(%r{/+\z}, '')
        page.data['search_exclude'] = true
        page.data['diff_base'] = true
        page.data['sitemap'] = false
        site.pages << page
      end
    rescue => e
      Jekyll.logger.warn "Git data:", "Failed to render main-branch diff bases: #{e.message}"
    end
  end
end