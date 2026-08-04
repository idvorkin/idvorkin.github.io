const Z = "ENTRIES", Q = "KEYS", B = "VALUES";
class E {
  constructor(t, e) {
    const s = t._tree, n = Array.from(s.keys());
    this.set = t, this._type = e, this._path = n.length > 0 ? [{ node: s, keys: n }] : [];
  }
  next() {
    const t = this.dive();
    return this.backtrack(), t;
  }
  dive() {
    if (this._path.length === 0)
      return { done: !0, value: void 0 };
    const { node: t, keys: e } = y(this._path);
    if (y(e) === "")
      return { done: !1, value: this.result() };
    const s = t.get(y(e));
    return this._path.push({ node: s, keys: Array.from(s.keys()) }), this.dive();
  }
  backtrack() {
    if (this._path.length === 0)
      return;
    const t = y(this._path).keys;
    t.pop(), !(t.length > 0) && (this._path.pop(), this.backtrack());
  }
  key() {
    return this.set._prefix + this._path.map(({ keys: t }) => y(t)).filter((t) => t !== "").join("");
  }
  value() {
    return y(this._path).node.get("");
  }
  result() {
    switch (this._type) {
      case B:
        return this.value();
      case Q:
        return this.key();
      default:
        return [this.key(), this.value()];
    }
  }
  [Symbol.iterator]() {
    return this;
  }
}
const y = (i) => i[i.length - 1], H = (i, t, e) => {
  const s = /* @__PURE__ */ new Map();
  if (t === void 0)
    return s;
  const n = t.length + 1, o = n + e, r = new Uint8Array(o * n).fill(e + 1);
  for (let c = 0; c < n; ++c)
    r[c] = c;
  for (let c = 1; c < o; ++c)
    r[c * n] = c;
  return U(i, t, e, s, r, 1, n, ""), s;
}, U = (i, t, e, s, n, o, r, c) => {
  const d = o * r;
  t: for (const u of i.keys())
    if (u === "") {
      const h = n[d - 1];
      h <= e && s.set(c, [i.get(u), h]);
    } else {
      let h = o;
      for (let l = 0; l < u.length; ++l, ++h) {
        const a = u[l], f = r * h, _ = f - r;
        let g = n[f];
        const m = Math.max(0, h - e - 1), p = Math.min(r - 1, h + e);
        for (let w = m; w < p; ++w) {
          const M = a !== t[w], k = n[_ + w] + +M, x = n[_ + w + 1] + 1, z = n[f + w] + 1, I = n[f + w + 1] = Math.min(k, x, z);
          I < g && (g = I);
        }
        if (g > e)
          continue t;
      }
      U(i.get(u), t, e, s, n, h, r, c + u);
    }
};
class F {
  /**
   * The constructor is normally called without arguments, creating an empty
   * map. In order to create a {@link SearchableMap} from an iterable or from an
   * object, check {@link SearchableMap.from} and {@link
   * SearchableMap.fromObject}.
   *
   * The constructor arguments are for internal use, when creating derived
   * mutable views of a map at a prefix.
   */
  constructor(t = /* @__PURE__ */ new Map(), e = "") {
    this._size = void 0, this._tree = t, this._prefix = e;
  }
  /**
   * Creates and returns a mutable view of this {@link SearchableMap},
   * containing only entries that share the given prefix.
   *
   * ### Usage:
   *
   * ```javascript
   * let map = new SearchableMap()
   * map.set("unicorn", 1)
   * map.set("universe", 2)
   * map.set("university", 3)
   * map.set("unique", 4)
   * map.set("hello", 5)
   *
   * let uni = map.atPrefix("uni")
   * uni.get("unique") // => 4
   * uni.get("unicorn") // => 1
   * uni.get("hello") // => undefined
   *
   * let univer = map.atPrefix("univer")
   * univer.get("unique") // => undefined
   * univer.get("universe") // => 2
   * univer.get("university") // => 3
   * ```
   *
   * @param prefix  The prefix
   * @return A {@link SearchableMap} representing a mutable view of the original
   * Map at the given prefix
   */
  atPrefix(t) {
    if (!t.startsWith(this._prefix))
      throw new Error("Mismatched prefix");
    const [e, s] = L(this._tree, t.slice(this._prefix.length));
    if (e === void 0) {
      const [n, o] = N(s);
      for (const r of n.keys())
        if (r !== "" && r.startsWith(o)) {
          const c = /* @__PURE__ */ new Map();
          return c.set(r.slice(o.length), n.get(r)), new F(c, t);
        }
    }
    return new F(e, t);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/clear
   */
  clear() {
    this._size = void 0, this._tree.clear();
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/delete
   * @param key  Key to delete
   */
  delete(t) {
    return this._size = void 0, X(this._tree, t);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/entries
   * @return An iterator iterating through `[key, value]` entries.
   */
  entries() {
    return new E(this, Z);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/forEach
   * @param fn  Iteration function
   */
  forEach(t) {
    for (const [e, s] of this)
      t(e, s, this);
  }
  /**
   * Returns a Map of all the entries that have a key within the given edit
   * distance from the search key. The keys of the returned Map are the matching
   * keys, while the values are two-element arrays where the first element is
   * the value associated to the key, and the second is the edit distance of the
   * key to the search key.
   *
   * ### Usage:
   *
   * ```javascript
   * let map = new SearchableMap()
   * map.set('hello', 'world')
   * map.set('hell', 'yeah')
   * map.set('ciao', 'mondo')
   *
   * // Get all entries that match the key 'hallo' with a maximum edit distance of 2
   * map.fuzzyGet('hallo', 2)
   * // => Map(2) { 'hello' => ['world', 1], 'hell' => ['yeah', 2] }
   *
   * // In the example, the "hello" key has value "world" and edit distance of 1
   * // (change "e" to "a"), the key "hell" has value "yeah" and edit distance of 2
   * // (change "e" to "a", delete "o")
   * ```
   *
   * @param key  The search key
   * @param maxEditDistance  The maximum edit distance (Levenshtein)
   * @return A Map of the matching keys to their value and edit distance
   */
  fuzzyGet(t, e) {
    return H(this._tree, t, e);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/get
   * @param key  Key to get
   * @return Value associated to the key, or `undefined` if the key is not
   * found.
   */
  get(t) {
    const e = T(this._tree, t);
    return e !== void 0 ? e.get("") : void 0;
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has
   * @param key  Key
   * @return True if the key is in the map, false otherwise
   */
  has(t) {
    const e = T(this._tree, t);
    return e !== void 0 && e.has("");
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/keys
   * @return An `Iterable` iterating through keys
   */
  keys() {
    return new E(this, Q);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/set
   * @param key  Key to set
   * @param value  Value to associate to the key
   * @return The {@link SearchableMap} itself, to allow chaining
   */
  set(t, e) {
    if (typeof t != "string")
      throw new Error("key must be a string");
    return this._size = void 0, V(this._tree, t).set("", e), this;
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/size
   */
  get size() {
    if (this._size)
      return this._size;
    this._size = 0;
    const t = this.entries();
    for (; !t.next().done; )
      this._size += 1;
    return this._size;
  }
  /**
   * Updates the value at the given key using the provided function. The function
   * is called with the current value at the key, and its return value is used as
   * the new value to be set.
   *
   * ### Example:
   *
   * ```javascript
   * // Increment the current value by one
   * searchableMap.update('somekey', (currentValue) => currentValue == null ? 0 : currentValue + 1)
   * ```
   *
   * If the value at the given key is or will be an object, it might not require
   * re-assignment. In that case it is better to use `fetch()`, because it is
   * faster.
   *
   * @param key  The key to update
   * @param fn  The function used to compute the new value from the current one
   * @return The {@link SearchableMap} itself, to allow chaining
   */
  update(t, e) {
    if (typeof t != "string")
      throw new Error("key must be a string");
    this._size = void 0;
    const s = V(this._tree, t);
    return s.set("", e(s.get(""))), this;
  }
  /**
   * Fetches the value of the given key. If the value does not exist, calls the
   * given function to create a new value, which is inserted at the given key
   * and subsequently returned.
   *
   * ### Example:
   *
   * ```javascript
   * const map = searchableMap.fetch('somekey', () => new Map())
   * map.set('foo', 'bar')
   * ```
   *
   * @param key  The key to update
   * @param initial  A function that creates a new value if the key does not exist
   * @return The existing or new value at the given key
   */
  fetch(t, e) {
    if (typeof t != "string")
      throw new Error("key must be a string");
    this._size = void 0;
    const s = V(this._tree, t);
    let n = s.get("");
    return n === void 0 && s.set("", n = e()), n;
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/values
   * @return An `Iterable` iterating through values.
   */
  values() {
    return new E(this, B);
  }
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/@@iterator
   */
  [Symbol.iterator]() {
    return this.entries();
  }
  /**
   * Creates a {@link SearchableMap} from an `Iterable` of entries
   *
   * @param entries  Entries to be inserted in the {@link SearchableMap}
   * @return A new {@link SearchableMap} with the given entries
   */
  static from(t) {
    const e = new F();
    for (const [s, n] of t)
      e.set(s, n);
    return e;
  }
  /**
   * Creates a {@link SearchableMap} from the iterable properties of a JavaScript object
   *
   * @param object  Object of entries for the {@link SearchableMap}
   * @return A new {@link SearchableMap} with the given entries
   */
  static fromObject(t) {
    return F.from(Object.entries(t));
  }
}
const L = (i, t, e = []) => {
  if (t.length === 0 || i == null)
    return [i, e];
  for (const s of i.keys())
    if (s !== "" && t.startsWith(s))
      return e.push([i, s]), L(i.get(s), t.slice(s.length), e);
  return e.push([i, t]), L(void 0, "", e);
}, T = (i, t) => {
  if (t.length === 0 || i == null)
    return i;
  for (const e of i.keys())
    if (e !== "" && t.startsWith(e))
      return T(i.get(e), t.slice(e.length));
}, V = (i, t) => {
  const e = t.length;
  t: for (let s = 0; i && s < e; ) {
    for (const o of i.keys())
      if (o !== "" && t[s] === o[0]) {
        const r = Math.min(e - s, o.length);
        let c = 1;
        for (; c < r && t[s + c] === o[c]; )
          ++c;
        const d = i.get(o);
        if (c === o.length)
          i = d;
        else {
          const u = /* @__PURE__ */ new Map();
          u.set(o.slice(c), d), i.set(t.slice(s, s + c), u), i.delete(o), i = u;
        }
        s += c;
        continue t;
      }
    const n = /* @__PURE__ */ new Map();
    return i.set(t.slice(s), n), n;
  }
  return i;
}, X = (i, t) => {
  const [e, s] = L(i, t);
  if (e !== void 0) {
    if (e.delete(""), e.size === 0)
      q(s);
    else if (e.size === 1) {
      const [n, o] = e.entries().next().value;
      K(s, n, o);
    }
  }
}, q = (i) => {
  if (i.length === 0)
    return;
  const [t, e] = N(i);
  if (t.delete(e), t.size === 0)
    q(i.slice(0, -1));
  else if (t.size === 1) {
    const [s, n] = t.entries().next().value;
    s !== "" && K(i.slice(0, -1), s, n);
  }
}, K = (i, t, e) => {
  if (i.length === 0)
    return;
  const [s, n] = N(i);
  s.set(n + t, e), s.delete(n);
}, N = (i) => i[i.length - 1], W = "or", G = "and", tt = "and_not";
class S {
  /**
   * @param options  Configuration options
   *
   * ### Examples:
   *
   * ```javascript
   * // Create a search engine that indexes the 'title' and 'text' fields of your
   * // documents:
   * const miniSearch = new MiniSearch({ fields: ['title', 'text'] })
   * ```
   *
   * ### ID Field:
   *
   * ```javascript
   * // Your documents are assumed to include a unique 'id' field, but if you want
   * // to use a different field for document identification, you can set the
   * // 'idField' option:
   * const miniSearch = new MiniSearch({ idField: 'key', fields: ['title', 'text'] })
   * ```
   *
   * ### Options and defaults:
   *
   * ```javascript
   * // The full set of options (here with their default value) is:
   * const miniSearch = new MiniSearch({
   *   // idField: field that uniquely identifies a document
   *   idField: 'id',
   *
   *   // extractField: function used to get the value of a field in a document.
   *   // By default, it assumes the document is a flat object with field names as
   *   // property keys and field values as string property values, but custom logic
   *   // can be implemented by setting this option to a custom extractor function.
   *   extractField: (document, fieldName) => document[fieldName],
   *
   *   // tokenize: function used to split fields into individual terms. By
   *   // default, it is also used to tokenize search queries, unless a specific
   *   // `tokenize` search option is supplied. When tokenizing an indexed field,
   *   // the field name is passed as the second argument.
   *   tokenize: (string, _fieldName) => string.split(SPACE_OR_PUNCTUATION),
   *
   *   // processTerm: function used to process each tokenized term before
   *   // indexing. It can be used for stemming and normalization. Return a falsy
   *   // value in order to discard a term. By default, it is also used to process
   *   // search queries, unless a specific `processTerm` option is supplied as a
   *   // search option. When processing a term from a indexed field, the field
   *   // name is passed as the second argument.
   *   processTerm: (term, _fieldName) => term.toLowerCase(),
   *
   *   // searchOptions: default search options, see the `search` method for
   *   // details
   *   searchOptions: undefined,
   *
   *   // fields: document fields to be indexed. Mandatory, but not set by default
   *   fields: undefined
   *
   *   // storeFields: document fields to be stored and returned as part of the
   *   // search results.
   *   storeFields: []
   * })
   * ```
   */
  constructor(t) {
    if (t?.fields == null)
      throw new Error('MiniSearch: option "fields" must be provided');
    const e = t.autoVacuum == null || t.autoVacuum === !0 ? A : t.autoVacuum;
    this._options = {
      ...O,
      ...t,
      autoVacuum: e,
      searchOptions: { ...P, ...t.searchOptions || {} },
      autoSuggestOptions: { ...ot, ...t.autoSuggestOptions || {} }
    }, this._index = new F(), this._documentCount = 0, this._documentIds = /* @__PURE__ */ new Map(), this._idToShortId = /* @__PURE__ */ new Map(), this._fieldIds = {}, this._fieldLength = /* @__PURE__ */ new Map(), this._avgFieldLength = [], this._nextId = 0, this._storedFields = /* @__PURE__ */ new Map(), this._dirtCount = 0, this._currentVacuum = null, this._enqueuedVacuum = null, this._enqueuedVacuumConditions = j, this.addFields(this._options.fields);
  }
  /**
   * Adds a document to the index
   *
   * @param document  The document to be indexed
   */
  add(t) {
    const { extractField: e, stringifyField: s, tokenize: n, processTerm: o, fields: r, idField: c } = this._options, d = e(t, c);
    if (d == null)
      throw new Error(`MiniSearch: document does not have ID field "${c}"`);
    if (this._idToShortId.has(d))
      throw new Error(`MiniSearch: duplicate ID ${d}`);
    const u = this.addDocumentId(d);
    this.saveStoredFields(u, t);
    for (const h of r) {
      const l = e(t, h);
      if (l == null)
        continue;
      const a = n(s(l, h), h), f = this._fieldIds[h], _ = new Set(a).size;
      this.addFieldLength(u, f, this._documentCount - 1, _);
      for (const g of a) {
        const m = o(g, h);
        if (Array.isArray(m))
          for (const p of m)
            this.addTerm(f, u, p);
        else m && this.addTerm(f, u, m);
      }
    }
  }
  /**
   * Adds all the given documents to the index
   *
   * @param documents  An array of documents to be indexed
   */
  addAll(t) {
    for (const e of t)
      this.add(e);
  }
  /**
   * Adds all the given documents to the index asynchronously.
   *
   * Returns a promise that resolves (to `undefined`) when the indexing is done.
   * This method is useful when index many documents, to avoid blocking the main
   * thread. The indexing is performed asynchronously and in chunks.
   *
   * @param documents  An array of documents to be indexed
   * @param options  Configuration options
   * @return A promise resolving to `undefined` when the indexing is done
   */
  addAllAsync(t, e = {}) {
    const { chunkSize: s = 10 } = e, n = { chunk: [], promise: Promise.resolve() }, { chunk: o, promise: r } = t.reduce(({ chunk: c, promise: d }, u, h) => (c.push(u), (h + 1) % s === 0 ? {
      chunk: [],
      promise: d.then(() => new Promise((l) => setTimeout(l, 0))).then(() => this.addAll(c))
    } : { chunk: c, promise: d }), n);
    return r.then(() => this.addAll(o));
  }
  /**
   * Removes the given document from the index.
   *
   * The document to remove must NOT have changed between indexing and removal,
   * otherwise the index will be corrupted.
   *
   * This method requires passing the full document to be removed (not just the
   * ID), and immediately removes the document from the inverted index, allowing
   * memory to be released. A convenient alternative is {@link
   * MiniSearch#discard}, which needs only the document ID, and has the same
   * visible effect, but delays cleaning up the index until the next vacuuming.
   *
   * @param document  The document to be removed
   */
  remove(t) {
    const { tokenize: e, processTerm: s, extractField: n, stringifyField: o, fields: r, idField: c } = this._options, d = n(t, c);
    if (d == null)
      throw new Error(`MiniSearch: document does not have ID field "${c}"`);
    const u = this._idToShortId.get(d);
    if (u == null)
      throw new Error(`MiniSearch: cannot remove document with ID ${d}: it is not in the index`);
    for (const h of r) {
      const l = n(t, h);
      if (l == null)
        continue;
      const a = e(o(l, h), h), f = this._fieldIds[h], _ = new Set(a).size;
      this.removeFieldLength(u, f, this._documentCount, _);
      for (const g of a) {
        const m = s(g, h);
        if (Array.isArray(m))
          for (const p of m)
            this.removeTerm(f, u, p);
        else m && this.removeTerm(f, u, m);
      }
    }
    this._storedFields.delete(u), this._documentIds.delete(u), this._idToShortId.delete(d), this._fieldLength.delete(u), this._documentCount -= 1;
  }
  /**
   * Removes all the given documents from the index. If called with no arguments,
   * it removes _all_ documents from the index.
   *
   * @param documents  The documents to be removed. If this argument is omitted,
   * all documents are removed. Note that, for removing all documents, it is
   * more efficient to call this method with no arguments than to pass all
   * documents.
   */
  removeAll(t) {
    if (t)
      for (const e of t)
        this.remove(e);
    else {
      if (arguments.length > 0)
        throw new Error("Expected documents to be present. Omit the argument to remove all documents.");
      this._index = new F(), this._documentCount = 0, this._documentIds = /* @__PURE__ */ new Map(), this._idToShortId = /* @__PURE__ */ new Map(), this._fieldLength = /* @__PURE__ */ new Map(), this._avgFieldLength = [], this._storedFields = /* @__PURE__ */ new Map(), this._nextId = 0;
    }
  }
  /**
   * Discards the document with the given ID, so it won't appear in search results
   *
   * It has the same visible effect of {@link MiniSearch.remove} (both cause the
   * document to stop appearing in searches), but a different effect on the
   * internal data structures:
   *
   *   - {@link MiniSearch#remove} requires passing the full document to be
   *   removed as argument, and removes it from the inverted index immediately.
   *
   *   - {@link MiniSearch#discard} instead only needs the document ID, and
   *   works by marking the current version of the document as discarded, so it
   *   is immediately ignored by searches. This is faster and more convenient
   *   than {@link MiniSearch#remove}, but the index is not immediately
   *   modified. To take care of that, vacuuming is performed after a certain
   *   number of documents are discarded, cleaning up the index and allowing
   *   memory to be released.
   *
   * After discarding a document, it is possible to re-add a new version, and
   * only the new version will appear in searches. In other words, discarding
   * and re-adding a document works exactly like removing and re-adding it. The
   * {@link MiniSearch.replace} method can also be used to replace a document
   * with a new version.
   *
   * #### Details about vacuuming
   *
   * Repetite calls to this method would leave obsolete document references in
   * the index, invisible to searches. Two mechanisms take care of cleaning up:
   * clean up during search, and vacuuming.
   *
   *   - Upon search, whenever a discarded ID is found (and ignored for the
   *   results), references to the discarded document are removed from the
   *   inverted index entries for the search terms. This ensures that subsequent
   *   searches for the same terms do not need to skip these obsolete references
   *   again.
   *
   *   - In addition, vacuuming is performed automatically by default (see the
   *   `autoVacuum` field in {@link Options}) after a certain number of
   *   documents are discarded. Vacuuming traverses all terms in the index,
   *   cleaning up all references to discarded documents. Vacuuming can also be
   *   triggered manually by calling {@link MiniSearch#vacuum}.
   *
   * @param id  The ID of the document to be discarded
   */
  discard(t) {
    const e = this._idToShortId.get(t);
    if (e == null)
      throw new Error(`MiniSearch: cannot discard document with ID ${t}: it is not in the index`);
    this._idToShortId.delete(t), this._documentIds.delete(e), this._storedFields.delete(e), (this._fieldLength.get(e) || []).forEach((s, n) => {
      this.removeFieldLength(e, n, this._documentCount, s);
    }), this._fieldLength.delete(e), this._documentCount -= 1, this._dirtCount += 1, this.maybeAutoVacuum();
  }
  maybeAutoVacuum() {
    if (this._options.autoVacuum === !1)
      return;
    const { minDirtFactor: t, minDirtCount: e, batchSize: s, batchWait: n } = this._options.autoVacuum;
    this.conditionalVacuum({ batchSize: s, batchWait: n }, { minDirtCount: e, minDirtFactor: t });
  }
  /**
   * Discards the documents with the given IDs, so they won't appear in search
   * results
   *
   * It is equivalent to calling {@link MiniSearch#discard} for all the given
   * IDs, but with the optimization of triggering at most one automatic
   * vacuuming at the end.
   *
   * Note: to remove all documents from the index, it is faster and more
   * convenient to call {@link MiniSearch.removeAll} with no argument, instead
   * of passing all IDs to this method.
   */
  discardAll(t) {
    const e = this._options.autoVacuum;
    try {
      this._options.autoVacuum = !1;
      for (const s of t)
        this.discard(s);
    } finally {
      this._options.autoVacuum = e;
    }
    this.maybeAutoVacuum();
  }
  /**
   * It replaces an existing document with the given updated version
   *
   * It works by discarding the current version and adding the updated one, so
   * it is functionally equivalent to calling {@link MiniSearch#discard}
   * followed by {@link MiniSearch#add}. The ID of the updated document should
   * be the same as the original one.
   *
   * Since it uses {@link MiniSearch#discard} internally, this method relies on
   * vacuuming to clean up obsolete document references from the index, allowing
   * memory to be released (see {@link MiniSearch#discard}).
   *
   * @param updatedDocument  The updated document to replace the old version
   * with
   */
  replace(t) {
    const { idField: e, extractField: s } = this._options, n = s(t, e);
    this.discard(n), this.add(t);
  }
  /**
   * Triggers a manual vacuuming, cleaning up references to discarded documents
   * from the inverted index
   *
   * Vacuuming is only useful for applications that use the {@link
   * MiniSearch#discard} or {@link MiniSearch#replace} methods.
   *
   * By default, vacuuming is performed automatically when needed (controlled by
   * the `autoVacuum` field in {@link Options}), so there is usually no need to
   * call this method, unless one wants to make sure to perform vacuuming at a
   * specific moment.
   *
   * Vacuuming traverses all terms in the inverted index in batches, and cleans
   * up references to discarded documents from the posting list, allowing memory
   * to be released.
   *
   * The method takes an optional object as argument with the following keys:
   *
   *   - `batchSize`: the size of each batch (1000 by default)
   *
   *   - `batchWait`: the number of milliseconds to wait between batches (10 by
   *   default)
   *
   * On large indexes, vacuuming could have a non-negligible cost: batching
   * avoids blocking the thread for long, diluting this cost so that it is not
   * negatively affecting the application. Nonetheless, this method should only
   * be called when necessary, and relying on automatic vacuuming is usually
   * better.
   *
   * It returns a promise that resolves (to undefined) when the clean up is
   * completed. If vacuuming is already ongoing at the time this method is
   * called, a new one is enqueued immediately after the ongoing one, and a
   * corresponding promise is returned. However, no more than one vacuuming is
   * enqueued on top of the ongoing one, even if this method is called more
   * times (enqueuing multiple ones would be useless).
   *
   * @param options  Configuration options for the batch size and delay. See
   * {@link VacuumOptions}.
   */
  vacuum(t = {}) {
    return this.conditionalVacuum(t);
  }
  conditionalVacuum(t, e) {
    return this._currentVacuum ? (this._enqueuedVacuumConditions = this._enqueuedVacuumConditions && e, this._enqueuedVacuum != null ? this._enqueuedVacuum : (this._enqueuedVacuum = this._currentVacuum.then(() => {
      const s = this._enqueuedVacuumConditions;
      return this._enqueuedVacuumConditions = j, this.performVacuuming(t, s);
    }), this._enqueuedVacuum)) : this.vacuumConditionsMet(e) === !1 ? Promise.resolve() : (this._currentVacuum = this.performVacuuming(t), this._currentVacuum);
  }
  async performVacuuming(t, e) {
    const s = this._dirtCount;
    if (this.vacuumConditionsMet(e)) {
      const n = t.batchSize || D.batchSize, o = t.batchWait || D.batchWait;
      let r = 1;
      for (const [c, d] of this._index) {
        for (const [u, h] of d)
          for (const [l] of h)
            this._documentIds.has(l) || (h.size <= 1 ? d.delete(u) : h.delete(l));
        this._index.get(c).size === 0 && this._index.delete(c), r % n === 0 && await new Promise((u) => setTimeout(u, o)), r += 1;
      }
      this._dirtCount -= s;
    }
    await null, this._currentVacuum = this._enqueuedVacuum, this._enqueuedVacuum = null;
  }
  vacuumConditionsMet(t) {
    if (t == null)
      return !0;
    let { minDirtCount: e, minDirtFactor: s } = t;
    return e = e || A.minDirtCount, s = s || A.minDirtFactor, this.dirtCount >= e && this.dirtFactor >= s;
  }
  /**
   * Is `true` if a vacuuming operation is ongoing, `false` otherwise
   */
  get isVacuuming() {
    return this._currentVacuum != null;
  }
  /**
   * The number of documents discarded since the most recent vacuuming
   */
  get dirtCount() {
    return this._dirtCount;
  }
  /**
   * A number between 0 and 1 giving an indication about the proportion of
   * documents that are discarded, and can therefore be cleaned up by vacuuming.
   * A value close to 0 means that the index is relatively clean, while a higher
   * value means that the index is relatively dirty, and vacuuming could release
   * memory.
   */
  get dirtFactor() {
    return this._dirtCount / (1 + this._documentCount + this._dirtCount);
  }
  /**
   * Returns `true` if a document with the given ID is present in the index and
   * available for search, `false` otherwise
   *
   * @param id  The document ID
   */
  has(t) {
    return this._idToShortId.has(t);
  }
  /**
   * Returns the stored fields (as configured in the `storeFields` constructor
   * option) for the given document ID. Returns `undefined` if the document is
   * not present in the index.
   *
   * @param id  The document ID
   */
  getStoredFields(t) {
    const e = this._idToShortId.get(t);
    if (e != null)
      return this._storedFields.get(e);
  }
  /**
   * Search for documents matching the given search query.
   *
   * The result is a list of scored document IDs matching the query, sorted by
   * descending score, and each including data about which terms were matched and
   * in which fields.
   *
   * ### Basic usage:
   *
   * ```javascript
   * // Search for "zen art motorcycle" with default options: terms have to match
   * // exactly, and individual terms are joined with OR
   * miniSearch.search('zen art motorcycle')
   * // => [ { id: 2, score: 2.77258, match: { ... } }, { id: 4, score: 1.38629, match: { ... } } ]
   * ```
   *
   * ### Restrict search to specific fields:
   *
   * ```javascript
   * // Search only in the 'title' field
   * miniSearch.search('zen', { fields: ['title'] })
   * ```
   *
   * ### Field boosting:
   *
   * ```javascript
   * // Boost a field
   * miniSearch.search('zen', { boost: { title: 2 } })
   * ```
   *
   * ### Prefix search:
   *
   * ```javascript
   * // Search for "moto" with prefix search (it will match documents
   * // containing terms that start with "moto" or "neuro")
   * miniSearch.search('moto neuro', { prefix: true })
   * ```
   *
   * ### Fuzzy search:
   *
   * ```javascript
   * // Search for "ismael" with fuzzy search (it will match documents containing
   * // terms similar to "ismael", with a maximum edit distance of 0.2 term.length
   * // (rounded to nearest integer)
   * miniSearch.search('ismael', { fuzzy: 0.2 })
   * ```
   *
   * ### Combining strategies:
   *
   * ```javascript
   * // Mix of exact match, prefix search, and fuzzy search
   * miniSearch.search('ismael mob', {
   *  prefix: true,
   *  fuzzy: 0.2
   * })
   * ```
   *
   * ### Advanced prefix and fuzzy search:
   *
   * ```javascript
   * // Perform fuzzy and prefix search depending on the search term. Here
   * // performing prefix and fuzzy search only on terms longer than 3 characters
   * miniSearch.search('ismael mob', {
   *  prefix: term => term.length > 3
   *  fuzzy: term => term.length > 3 ? 0.2 : null
   * })
   * ```
   *
   * ### Combine with AND:
   *
   * ```javascript
   * // Combine search terms with AND (to match only documents that contain both
   * // "motorcycle" and "art")
   * miniSearch.search('motorcycle art', { combineWith: 'AND' })
   * ```
   *
   * ### Combine with AND_NOT:
   *
   * There is also an AND_NOT combinator, that finds documents that match the
   * first term, but do not match any of the other terms. This combinator is
   * rarely useful with simple queries, and is meant to be used with advanced
   * query combinations (see later for more details).
   *
   * ### Filtering results:
   *
   * ```javascript
   * // Filter only results in the 'fiction' category (assuming that 'category'
   * // is a stored field)
   * miniSearch.search('motorcycle art', {
   *   filter: (result) => result.category === 'fiction'
   * })
   * ```
   *
   * ### Wildcard query
   *
   * Searching for an empty string (assuming the default tokenizer) returns no
   * results. Sometimes though, one needs to match all documents, like in a
   * "wildcard" search. This is possible by passing the special value
   * {@link MiniSearch.wildcard} as the query:
   *
   * ```javascript
   * // Return search results for all documents
   * miniSearch.search(MiniSearch.wildcard)
   * ```
   *
   * Note that search options such as `filter` and `boostDocument` are still
   * applied, influencing which results are returned, and their order:
   *
   * ```javascript
   * // Return search results for all documents in the 'fiction' category
   * miniSearch.search(MiniSearch.wildcard, {
   *   filter: (result) => result.category === 'fiction'
   * })
   * ```
   *
   * ### Advanced combination of queries:
   *
   * It is possible to combine different subqueries with OR, AND, and AND_NOT,
   * and even with different search options, by passing a query expression
   * tree object as the first argument, instead of a string.
   *
   * ```javascript
   * // Search for documents that contain "zen" and ("motorcycle" or "archery")
   * miniSearch.search({
   *   combineWith: 'AND',
   *   queries: [
   *     'zen',
   *     {
   *       combineWith: 'OR',
   *       queries: ['motorcycle', 'archery']
   *     }
   *   ]
   * })
   *
   * // Search for documents that contain ("apple" or "pear") but not "juice" and
   * // not "tree"
   * miniSearch.search({
   *   combineWith: 'AND_NOT',
   *   queries: [
   *     {
   *       combineWith: 'OR',
   *       queries: ['apple', 'pear']
   *     },
   *     'juice',
   *     'tree'
   *   ]
   * })
   * ```
   *
   * Each node in the expression tree can be either a string, or an object that
   * supports all {@link SearchOptions} fields, plus a `queries` array field for
   * subqueries.
   *
   * Note that, while this can become complicated to do by hand for complex or
   * deeply nested queries, it provides a formalized expression tree API for
   * external libraries that implement a parser for custom query languages.
   *
   * @param query  Search query
   * @param searchOptions  Search options. Each option, if not given, defaults to the corresponding value of `searchOptions` given to the constructor, or to the library default.
   */
  search(t, e = {}) {
    const { searchOptions: s } = this._options, n = { ...s, ...e }, o = this.executeQuery(t, e), r = [];
    for (const [c, { score: d, terms: u, match: h }] of o) {
      const l = u.length || 1, a = {
        id: this._documentIds.get(c),
        score: d * l,
        terms: Object.keys(h),
        queryTerms: u,
        match: h
      };
      Object.assign(a, this._storedFields.get(c)), (n.filter == null || n.filter(a)) && r.push(a);
    }
    return t === S.wildcard && n.boostDocument == null || r.sort(J), r;
  }
  /**
   * Provide suggestions for the given search query
   *
   * The result is a list of suggested modified search queries, derived from the
   * given search query, each with a relevance score, sorted by descending score.
   *
   * By default, it uses the same options used for search, except that by
   * default it performs prefix search on the last term of the query, and
   * combine terms with `'AND'` (requiring all query terms to match). Custom
   * options can be passed as a second argument. Defaults can be changed upon
   * calling the {@link MiniSearch} constructor, by passing a
   * `autoSuggestOptions` option.
   *
   * ### Basic usage:
   *
   * ```javascript
   * // Get suggestions for 'neuro':
   * miniSearch.autoSuggest('neuro')
   * // => [ { suggestion: 'neuromancer', terms: [ 'neuromancer' ], score: 0.46240 } ]
   * ```
   *
   * ### Multiple words:
   *
   * ```javascript
   * // Get suggestions for 'zen ar':
   * miniSearch.autoSuggest('zen ar')
   * // => [
   * //  { suggestion: 'zen archery art', terms: [ 'zen', 'archery', 'art' ], score: 1.73332 },
   * //  { suggestion: 'zen art', terms: [ 'zen', 'art' ], score: 1.21313 }
   * // ]
   * ```
   *
   * ### Fuzzy suggestions:
   *
   * ```javascript
   * // Correct spelling mistakes using fuzzy search:
   * miniSearch.autoSuggest('neromancer', { fuzzy: 0.2 })
   * // => [ { suggestion: 'neuromancer', terms: [ 'neuromancer' ], score: 1.03998 } ]
   * ```
   *
   * ### Filtering:
   *
   * ```javascript
   * // Get suggestions for 'zen ar', but only within the 'fiction' category
   * // (assuming that 'category' is a stored field):
   * miniSearch.autoSuggest('zen ar', {
   *   filter: (result) => result.category === 'fiction'
   * })
   * // => [
   * //  { suggestion: 'zen archery art', terms: [ 'zen', 'archery', 'art' ], score: 1.73332 },
   * //  { suggestion: 'zen art', terms: [ 'zen', 'art' ], score: 1.21313 }
   * // ]
   * ```
   *
   * @param queryString  Query string to be expanded into suggestions
   * @param options  Search options. The supported options and default values
   * are the same as for the {@link MiniSearch#search} method, except that by
   * default prefix search is performed on the last term in the query, and terms
   * are combined with `'AND'`.
   * @return  A sorted array of suggestions sorted by relevance score.
   */
  autoSuggest(t, e = {}) {
    e = { ...this._options.autoSuggestOptions, ...e };
    const s = /* @__PURE__ */ new Map();
    for (const { score: o, terms: r } of this.search(t, e)) {
      const c = r.join(" "), d = s.get(c);
      d != null ? (d.score += o, d.count += 1) : s.set(c, { score: o, terms: r, count: 1 });
    }
    const n = [];
    for (const [o, { score: r, terms: c, count: d }] of s)
      n.push({ suggestion: o, terms: c, score: r / d });
    return n.sort(J), n;
  }
  /**
   * Total number of documents available to search
   */
  get documentCount() {
    return this._documentCount;
  }
  /**
   * Number of terms in the index
   */
  get termCount() {
    return this._index.size;
  }
  /**
   * Deserializes a JSON index (serialized with `JSON.stringify(miniSearch)`)
   * and instantiates a MiniSearch instance. It should be given the same options
   * originally used when serializing the index.
   *
   * ### Usage:
   *
   * ```javascript
   * // If the index was serialized with:
   * let miniSearch = new MiniSearch({ fields: ['title', 'text'] })
   * miniSearch.addAll(documents)
   *
   * const json = JSON.stringify(miniSearch)
   * // It can later be deserialized like this:
   * miniSearch = MiniSearch.loadJSON(json, { fields: ['title', 'text'] })
   * ```
   *
   * @param json  JSON-serialized index
   * @param options  configuration options, same as the constructor
   * @return An instance of MiniSearch deserialized from the given JSON.
   */
  static loadJSON(t, e) {
    if (e == null)
      throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");
    return this.loadJS(JSON.parse(t), e);
  }
  /**
   * Async equivalent of {@link MiniSearch.loadJSON}
   *
   * This function is an alternative to {@link MiniSearch.loadJSON} that returns
   * a promise, and loads the index in batches, leaving pauses between them to avoid
   * blocking the main thread. It tends to be slower than the synchronous
   * version, but does not block the main thread, so it can be a better choice
   * when deserializing very large indexes.
   *
   * @param json  JSON-serialized index
   * @param options  configuration options, same as the constructor
   * @return A Promise that will resolve to an instance of MiniSearch deserialized from the given JSON.
   */
  static async loadJSONAsync(t, e) {
    if (e == null)
      throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");
    return this.loadJSAsync(JSON.parse(t), e);
  }
  /**
   * Returns the default value of an option. It will throw an error if no option
   * with the given name exists.
   *
   * @param optionName  Name of the option
   * @return The default value of the given option
   *
   * ### Usage:
   *
   * ```javascript
   * // Get default tokenizer
   * MiniSearch.getDefault('tokenize')
   *
   * // Get default term processor
   * MiniSearch.getDefault('processTerm')
   *
   * // Unknown options will throw an error
   * MiniSearch.getDefault('notExisting')
   * // => throws 'MiniSearch: unknown option "notExisting"'
   * ```
   */
  static getDefault(t) {
    if (O.hasOwnProperty(t))
      return C(O, t);
    throw new Error(`MiniSearch: unknown option "${t}"`);
  }
  /**
   * @ignore
   */
  static loadJS(t, e) {
    const { index: s, documentIds: n, fieldLength: o, storedFields: r, serializationVersion: c } = t, d = this.instantiateMiniSearch(t, e);
    d._documentIds = v(n), d._fieldLength = v(o), d._storedFields = v(r);
    for (const [u, h] of d._documentIds)
      d._idToShortId.set(h, u);
    for (const [u, h] of s) {
      const l = /* @__PURE__ */ new Map();
      for (const a of Object.keys(h)) {
        let f = h[a];
        c === 1 && (f = f.ds), l.set(parseInt(a, 10), v(f));
      }
      d._index.set(u, l);
    }
    return d;
  }
  /**
   * @ignore
   */
  static async loadJSAsync(t, e) {
    const { index: s, documentIds: n, fieldLength: o, storedFields: r, serializationVersion: c } = t, d = this.instantiateMiniSearch(t, e);
    d._documentIds = await b(n), d._fieldLength = await b(o), d._storedFields = await b(r);
    for (const [h, l] of d._documentIds)
      d._idToShortId.set(l, h);
    let u = 0;
    for (const [h, l] of s) {
      const a = /* @__PURE__ */ new Map();
      for (const f of Object.keys(l)) {
        let _ = l[f];
        c === 1 && (_ = _.ds), a.set(parseInt(f, 10), await b(_));
      }
      ++u % 1e3 === 0 && await Y(0), d._index.set(h, a);
    }
    return d;
  }
  /**
   * @ignore
   */
  static instantiateMiniSearch(t, e) {
    const { documentCount: s, nextId: n, fieldIds: o, averageFieldLength: r, dirtCount: c, serializationVersion: d } = t;
    if (d !== 1 && d !== 2)
      throw new Error("MiniSearch: cannot deserialize an index created with an incompatible version");
    const u = new S(e);
    return u._documentCount = s, u._nextId = n, u._idToShortId = /* @__PURE__ */ new Map(), u._fieldIds = o, u._avgFieldLength = r, u._dirtCount = c || 0, u._index = new F(), u;
  }
  /**
   * @ignore
   */
  executeQuery(t, e = {}) {
    if (t === S.wildcard)
      return this.executeWildcardQuery(e);
    if (typeof t != "string") {
      const a = { ...e, ...t, queries: void 0 }, f = t.queries.map((_) => this.executeQuery(_, a));
      return this.combineResults(f, a.combineWith);
    }
    const { tokenize: s, processTerm: n, searchOptions: o } = this._options, r = { tokenize: s, processTerm: n, ...o, ...e }, { tokenize: c, processTerm: d } = r, l = c(t).flatMap((a) => d(a)).filter((a) => !!a).map(it(r)).map((a) => this.executeQuerySpec(a, r));
    return this.combineResults(l, r.combineWith);
  }
  /**
   * @ignore
   */
  executeQuerySpec(t, e) {
    const s = { ...this._options.searchOptions, ...e }, n = (s.fields || this._options.fields).reduce((g, m) => ({ ...g, [m]: C(s.boost, m) || 1 }), {}), { boostDocument: o, weights: r, maxFuzzy: c, bm25: d } = s, { fuzzy: u, prefix: h } = { ...P.weights, ...r }, l = this._index.get(t.term), a = this.termResults(t.term, t.term, 1, t.termBoost, l, n, o, d);
    let f, _;
    if (t.prefix && (f = this._index.atPrefix(t.term)), t.fuzzy) {
      const g = t.fuzzy === !0 ? 0.2 : t.fuzzy, m = g < 1 ? Math.min(c, Math.round(t.term.length * g)) : g;
      m && (_ = this._index.fuzzyGet(t.term, m));
    }
    if (f)
      for (const [g, m] of f) {
        const p = g.length - t.term.length;
        if (!p)
          continue;
        _?.delete(g);
        const w = h * g.length / (g.length + 0.3 * p);
        this.termResults(t.term, g, w, t.termBoost, m, n, o, d, a);
      }
    if (_)
      for (const g of _.keys()) {
        const [m, p] = _.get(g);
        if (!p)
          continue;
        const w = u * g.length / (g.length + p);
        this.termResults(t.term, g, w, t.termBoost, m, n, o, d, a);
      }
    return a;
  }
  /**
   * @ignore
   */
  executeWildcardQuery(t) {
    const e = /* @__PURE__ */ new Map(), s = { ...this._options.searchOptions, ...t };
    for (const [n, o] of this._documentIds) {
      const r = s.boostDocument ? s.boostDocument(o, "", this._storedFields.get(n)) : 1;
      e.set(n, {
        score: r,
        terms: [],
        match: {}
      });
    }
    return e;
  }
  /**
   * @ignore
   */
  combineResults(t, e = W) {
    if (t.length === 0)
      return /* @__PURE__ */ new Map();
    const s = e.toLowerCase(), n = et[s];
    if (!n)
      throw new Error(`Invalid combination operator: ${e}`);
    return t.reduce(n) || /* @__PURE__ */ new Map();
  }
  /**
   * Allows serialization of the index to JSON, to possibly store it and later
   * deserialize it with {@link MiniSearch.loadJSON}.
   *
   * Normally one does not directly call this method, but rather call the
   * standard JavaScript `JSON.stringify()` passing the {@link MiniSearch}
   * instance, and JavaScript will internally call this method. Upon
   * deserialization, one must pass to {@link MiniSearch.loadJSON} the same
   * options used to create the original instance that was serialized.
   *
   * ### Usage:
   *
   * ```javascript
   * // Serialize the index:
   * let miniSearch = new MiniSearch({ fields: ['title', 'text'] })
   * miniSearch.addAll(documents)
   * const json = JSON.stringify(miniSearch)
   *
   * // Later, to deserialize it:
   * miniSearch = MiniSearch.loadJSON(json, { fields: ['title', 'text'] })
   * ```
   *
   * @return A plain-object serializable representation of the search index.
   */
  toJSON() {
    const t = [];
    for (const [e, s] of this._index) {
      const n = {};
      for (const [o, r] of s)
        n[o] = Object.fromEntries(r);
      t.push([e, n]);
    }
    return {
      documentCount: this._documentCount,
      nextId: this._nextId,
      documentIds: Object.fromEntries(this._documentIds),
      fieldIds: this._fieldIds,
      fieldLength: Object.fromEntries(this._fieldLength),
      averageFieldLength: this._avgFieldLength,
      storedFields: Object.fromEntries(this._storedFields),
      dirtCount: this._dirtCount,
      index: t,
      serializationVersion: 2
    };
  }
  /**
   * @ignore
   */
  termResults(t, e, s, n, o, r, c, d, u = /* @__PURE__ */ new Map()) {
    if (o == null)
      return u;
    for (const h of Object.keys(r)) {
      const l = r[h], a = this._fieldIds[h], f = o.get(a);
      if (f == null)
        continue;
      let _ = f.size;
      const g = this._avgFieldLength[a];
      for (const m of f.keys()) {
        if (!this._documentIds.has(m)) {
          this.removeTerm(a, m, e), _ -= 1;
          continue;
        }
        const p = c ? c(this._documentIds.get(m), e, this._storedFields.get(m)) : 1;
        if (!p)
          continue;
        const w = f.get(m), M = this._fieldLength.get(m)[a], k = nt(w, _, this._documentCount, M, g, d), x = s * n * l * p * k, z = u.get(m);
        if (z) {
          z.score += x, rt(z.terms, t);
          const I = C(z.match, e);
          I ? I.push(h) : z.match[e] = [h];
        } else
          u.set(m, {
            score: x,
            terms: [t],
            match: { [e]: [h] }
          });
      }
    }
    return u;
  }
  /**
   * @ignore
   */
  addTerm(t, e, s) {
    const n = this._index.fetch(s, $);
    let o = n.get(t);
    if (o == null)
      o = /* @__PURE__ */ new Map(), o.set(e, 1), n.set(t, o);
    else {
      const r = o.get(e);
      o.set(e, (r || 0) + 1);
    }
  }
  /**
   * @ignore
   */
  removeTerm(t, e, s) {
    if (!this._index.has(s)) {
      this.warnDocumentChanged(e, t, s);
      return;
    }
    const n = this._index.fetch(s, $), o = n.get(t);
    o == null || o.get(e) == null ? this.warnDocumentChanged(e, t, s) : o.get(e) <= 1 ? o.size <= 1 ? n.delete(t) : o.delete(e) : o.set(e, o.get(e) - 1), this._index.get(s).size === 0 && this._index.delete(s);
  }
  /**
   * @ignore
   */
  warnDocumentChanged(t, e, s) {
    for (const n of Object.keys(this._fieldIds))
      if (this._fieldIds[n] === e) {
        this._options.logger("warn", `MiniSearch: document with ID ${this._documentIds.get(t)} has changed before removal: term "${s}" was not present in field "${n}". Removing a document after it has changed can corrupt the index!`, "version_conflict");
        return;
      }
  }
  /**
   * @ignore
   */
  addDocumentId(t) {
    const e = this._nextId;
    return this._idToShortId.set(t, e), this._documentIds.set(e, t), this._documentCount += 1, this._nextId += 1, e;
  }
  /**
   * @ignore
   */
  addFields(t) {
    for (let e = 0; e < t.length; e++)
      this._fieldIds[t[e]] = e;
  }
  /**
   * @ignore
   */
  addFieldLength(t, e, s, n) {
    let o = this._fieldLength.get(t);
    o == null && this._fieldLength.set(t, o = []), o[e] = n;
    const c = (this._avgFieldLength[e] || 0) * s + n;
    this._avgFieldLength[e] = c / (s + 1);
  }
  /**
   * @ignore
   */
  removeFieldLength(t, e, s, n) {
    if (s === 1) {
      this._avgFieldLength[e] = 0;
      return;
    }
    const o = this._avgFieldLength[e] * s - n;
    this._avgFieldLength[e] = o / (s - 1);
  }
  /**
   * @ignore
   */
  saveStoredFields(t, e) {
    const { storeFields: s, extractField: n } = this._options;
    if (s == null || s.length === 0)
      return;
    let o = this._storedFields.get(t);
    o == null && this._storedFields.set(t, o = {});
    for (const r of s) {
      const c = n(e, r);
      c !== void 0 && (o[r] = c);
    }
  }
}
S.wildcard = /* @__PURE__ */ Symbol("*");
const C = (i, t) => Object.prototype.hasOwnProperty.call(i, t) ? i[t] : void 0, et = {
  [W]: (i, t) => {
    for (const e of t.keys()) {
      const s = i.get(e);
      if (s == null)
        i.set(e, t.get(e));
      else {
        const { score: n, terms: o, match: r } = t.get(e);
        s.score = s.score + n, s.match = Object.assign(s.match, r), R(s.terms, o);
      }
    }
    return i;
  },
  [G]: (i, t) => {
    const e = /* @__PURE__ */ new Map();
    for (const s of t.keys()) {
      const n = i.get(s);
      if (n == null)
        continue;
      const { score: o, terms: r, match: c } = t.get(s);
      R(n.terms, r), e.set(s, {
        score: n.score + o,
        terms: n.terms,
        match: Object.assign(n.match, c)
      });
    }
    return e;
  },
  [tt]: (i, t) => {
    for (const e of t.keys())
      i.delete(e);
    return i;
  }
}, st = { k: 1.2, b: 0.7, d: 0.5 }, nt = (i, t, e, s, n, o) => {
  const { k: r, b: c, d } = o;
  return Math.log(1 + (e - t + 0.5) / (t + 0.5)) * (d + i * (r + 1) / (i + r * (1 - c + c * s / n)));
}, it = (i) => (t, e, s) => {
  const n = typeof i.fuzzy == "function" ? i.fuzzy(t, e, s) : i.fuzzy || !1, o = typeof i.prefix == "function" ? i.prefix(t, e, s) : i.prefix === !0, r = typeof i.boostTerm == "function" ? i.boostTerm(t, e, s) : 1;
  return { term: t, fuzzy: n, prefix: o, termBoost: r };
}, O = {
  idField: "id",
  extractField: (i, t) => i[t],
  stringifyField: (i, t) => i.toString(),
  tokenize: (i) => i.split(ct),
  processTerm: (i) => i.toLowerCase(),
  fields: void 0,
  searchOptions: void 0,
  storeFields: [],
  logger: (i, t) => {
    typeof console?.[i] == "function" && console[i](t);
  },
  autoVacuum: !0
}, P = {
  combineWith: W,
  prefix: !1,
  fuzzy: !1,
  maxFuzzy: 6,
  boost: {},
  weights: { fuzzy: 0.45, prefix: 0.375 },
  bm25: st
}, ot = {
  combineWith: G,
  prefix: (i, t, e) => t === e.length - 1
}, D = { batchSize: 1e3, batchWait: 10 }, j = { minDirtFactor: 0.1, minDirtCount: 20 }, A = { ...D, ...j }, rt = (i, t) => {
  i.includes(t) || i.push(t);
}, R = (i, t) => {
  for (const e of t)
    i.includes(e) || i.push(e);
}, J = ({ score: i }, { score: t }) => t - i, $ = () => /* @__PURE__ */ new Map(), v = (i) => {
  const t = /* @__PURE__ */ new Map();
  for (const e of Object.keys(i))
    t.set(parseInt(e, 10), i[e]);
  return t;
}, b = async (i) => {
  const t = /* @__PURE__ */ new Map();
  let e = 0;
  for (const s of Object.keys(i))
    t.set(parseInt(s, 10), i[s]), ++e % 1e3 === 0 && await Y(0);
  return t;
}, Y = (i) => new Promise((t) => setTimeout(t, i)), ct = /[\n\r\p{Z}\p{P}]+/u;
export {
  S as default
};
//# sourceMappingURL=minisearch.js.map
