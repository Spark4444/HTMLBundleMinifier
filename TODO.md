2. Optimize the base64 conversion by storing already converted files in a map and then reusing them.
3. Do the same for the fetched files, instead of refetching them store and reuse them.