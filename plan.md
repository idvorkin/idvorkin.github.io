# Plan: Complete Mitzvahs.md - Parallel Execution Strategy

**File**: `/home/developer/gits/idvorkin.github.io/_d/mitzvahs.md`
**Issue**: blog-qvi
**Branch**: `fix/mitzvahs-completion`

**Current Status**:
- Alert box updated ✓
- Positive commandments mostly complete through #174
- Positive commandments #175-248 need completion (incomplete entries)
- Negative commandments have formatting issues and many duplicates

## Format to Follow

Each commandment should be converted from HTML `<ol>` to markdown format:

```markdown
51. **Offer all sacrifices in the Temple**

   [Leviticus X:Y](https://www.sefaria.org/Leviticus.X.Y): "Biblical text from Contemporary Torah (JPS 2006)"
```

## Remaining Work

### Positive Commandments (74 remaining)

1. **Temple Service (51-85)** - 35 commandments
   - Currently in HTML `<ol>` format starting at line ~286
   - These cover sacrifices, priestly duties, Temple furnishings

2. **War and Justice (175-183)** - 9 commandments
   - Currently in HTML `<ol>` format starting at line ~698
   - Covers war protocols, Amalek, destroying idolatry

3. **Property and Commerce (184-248)** - ~30 commandments remaining
   - Some may already be completed, check file
   - Covers property rights, honoring parents, slaves, etc.

### Negative Commandments (365 total)

All sections from line ~399 onwards need conversion from HTML to markdown:

- **Idolatry and Blasphemy (1-18)** - 18 commandments
- **Forbidden Worship (19-33)** - 15 commandments
- **Forbidden Sexual Relations (34-70)** - 37 commandments
- **Forbidden Foods (71-119)** - 49 commandments
- **Prohibited Business Practices (120-151)** - 32 commandments
- **Prohibited Speech (152-167)** - 16 commandments
- **Prohibited Violence (168-194)** - 27 commandments
- **Temple Prohibitions (194-240)** - 47 commandments
- **Priestly Prohibitions (240-252)** - 13 commandments
- **Prohibited Agricultural Practices (253-283)** - 31 commandments
- **Prohibited Magic and Divination (283-290)** - 8 commandments
- **Prohibited Personal Conduct (290-302)** - 13 commandments
- **Prohibited Legal Actions (302-350)** - 49 commandments
- **Prohibited Treatment of Animals (350-358)** - 9 commandments
- **Prohibited Family Actions (358-365)** - 8 commandments

## Recommended Approach

### Strategy: Parallel Task Execution

Create separate bd issues for each parallelizable task:

#### Phase 1: Positive Commandments (Can run in parallel)

**Task A**: Complete War & Justice (#175-183) - 8 commandments
- Deuteronomy 20 (war laws), Deuteronomy 22:8 (parapet)
- Estimated: 1-2 hours

**Task B**: Complete Property Part 1 (#184-210) - ~27 commandments
- Honor parents, property rights, worker laws
- Estimated: 3-4 hours

**Task C**: Complete Property Part 2 (#211-248) - ~38 commandments
- Courts, Temple service, purity laws
- Estimated: 4-5 hours

#### Phase 2: Negative Commandments Review (Can run in parallel)

**Task D**: Audit duplicate annotations
- Review all "(duplicates #X)" entries
- Verify against Maimonides' enumeration
- Decide: keep, remove, or consolidate
- Estimated: 3 hours

#### Phase 3: Quality Pass (After Phases 1-2)

**Task E**: Final verification
- Check all Sefaria links
- Ensure consistent formatting
- Verify Torah references
- Estimated: 2 hours

---

## Creating bd Issues for Parallel Work

```bash
# Task A
bd create "Complete War & Justice mitzvahs #175-183" \
  -d "Complete 8 mitzvahs in War & Justice section with Torah sources" \
  -p 1 --label mitzvahs

# Task B
bd create "Complete Property mitzvahs #184-210" \
  -d "Complete ~27 mitzvahs covering honor, property, worker rights" \
  -p 1 --label mitzvahs

# Task C
bd create "Complete Property mitzvahs #211-248" \
  -d "Complete ~38 mitzvahs covering courts, purity, Temple service" \
  -p 1 --label mitzvahs

# Task D
bd create "Audit negative commandment duplicates" \
  -d "Review and resolve all duplicate annotations in negative commandments" \
  -p 2 --label mitzvahs

# Task E
bd create "Final quality pass on mitzvahs.md" \
  -d "Verify links, formatting, and Torah references after completion" \
  -p 2 --label mitzvahs \
  -D blog-qvi
```

### Each Agent Should:

1. **Research Torah sources** using:
   - Sefaria.org for verse lookups
   - Maimonides' Sefer HaMitzvot as reference
   - JewFAQ.org comprehensive list

2. **Fetch English text** from Sefaria.org:
   - URL format: `https://www.sefaria.org/[Book].[Chapter].[Verse]`
   - Use Contemporary Torah translation (JPS 2006)
   - Use WebFetch tool to retrieve verses

3. **Return formatted markdown** (DON'T edit file directly):
   - Format exactly as shown in completed sections
   - Include bold titles, Sefaria links, biblical text
   - Return the complete text for their assigned section

4. **After all agents complete**: Merge results into file sequentially

## Research Resources

- **Sefaria.org**: Primary source for verse text
  - `https://www.sefaria.org/Exodus.20.2`
  - `https://www.sefaria.org/Leviticus.19.18`

- **Comprehensive Lists**:
  - `https://www.jewfaq.org/613_commandments`
  - `https://mechon-mamre.org/jewfaq/613.htm`

- **Sefer HaMitzvot** (Maimonides):
  - `https://www.sefaria.org/Sefer_HaMitzvot`
  - Access individual commandments via `/Sefer_HaMitzvot,_Positive_Commandments.51`

## Important Notes

- **Shared verses are normal**: Multiple commandments often cite the same Torah verse (this is correct in Maimonides' system)
- **Negative commandments**: Often reference the same prohibitive verses
- **Temple commandments**: Many are no longer practiced (Temple destroyed 70 CE) but should still be documented
- **Formatting consistency**: Maintain exact markdown format as shown in completed sections (1-174)
- **Hebrew divine name**: Use יהוה as it appears in Contemporary Torah translation

## Example of Completed Work

See commandments 1-174 in the file for reference formatting:
- Lines 76-106: Relationship with God (good example)
- Lines 426-492: Festivals (good example with longer verses)
- Lines 668-694: Tzedakah and Kindness (good example)

## Verification

After completion, verify:
- All 613 commandments have Torah citations
- All use markdown format (no HTML `<ol>` remaining)
- All links point to Sefaria.org
- All use Contemporary Torah (JPS 2006) English text
