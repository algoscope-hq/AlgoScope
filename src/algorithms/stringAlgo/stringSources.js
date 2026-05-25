export const stringSources = {
  kmp: {
    javascript: {
      code: `function computeLPS(pattern) {
  const lps = new Array(pattern.length).fill(0)
  let len = 0, i = 1
  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      lps[i++] = ++len
    } else if (len) {
      len = lps[len - 1]
    } else {
      lps[i++] = 0
    }
  }
  return lps
}

function kmpSearch(text, pattern) {
  const lps = computeLPS(pattern)
  const matches = []
  let i = 0, j = 0
  while (i < text.length) {
    if (text[i] === pattern[j]) { i++; j++ }
    if (j === pattern.length) {
      matches.push(i - j)
      j = lps[j - 1]
    } else if (i < text.length && text[i] !== pattern[j]) {
      j ? (j = lps[j - 1]) : i++
    }
  }
  return matches
}

console.log(kmpSearch('AABAACAADAABAABA', 'AABA'))`,
    },
    python: {
      code: `def compute_lps(pattern):
    lps = [0] * len(pattern)
    length, i = 0, 1
    while i < len(pattern):
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    lps = compute_lps(pattern)
    matches, i, j = [], 0, 0
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1; j += 1
        if j == len(pattern):
            matches.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and text[i] != pattern[j]:
            j = lps[j - 1] if j else (i := i + 1) and 0
    return matches

print(kmp_search('AABAACAADAABAABA', 'AABA'))`,
    },
    cpp: {
      code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> computeLPS(const string& pattern) {
    int m = pattern.size();
    vector<int> lps(m, 0);
    int len = 0, i = 1;
    while (i < m) {
        if (pattern[i] == pattern[len]) lps[i++] = ++len;
        else if (len) len = lps[len - 1];
        else lps[i++] = 0;
    }
    return lps;
}

vector<int> kmpSearch(const string& text, const string& pattern) {
    vector<int> lps = computeLPS(pattern), matches;
    int n = text.size(), m = pattern.size(), i = 0, j = 0;
    while (i < n) {
        if (text[i] == pattern[j]) { i++; j++; }
        if (j == m) { matches.push_back(i - j); j = lps[j - 1]; }
        else if (i < n && text[i] != pattern[j])
            j ? (j = lps[j - 1]) : i++;
    }
    return matches;
}

int main() {
    auto res = kmpSearch("AABAACAADAABAABA", "AABA");
    for (int idx : res) cout << idx << " ";
}`,
    },
    java: {
      code: `import java.util.*;

public class KMP {
    static int[] computeLPS(String pattern) {
        int m = pattern.length();
        int[] lps = new int[m];
        int len = 0, i = 1;
        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) lps[i++] = ++len;
            else if (len != 0) len = lps[len - 1];
            else lps[i++] = 0;
        }
        return lps;
    }

    static List<Integer> kmpSearch(String text, String pattern) {
        int[] lps = computeLPS(pattern);
        List<Integer> matches = new ArrayList<>();
        int n = text.length(), m = pattern.length(), i = 0, j = 0;
        while (i < n) {
            if (text.charAt(i) == pattern.charAt(j)) { i++; j++; }
            if (j == m) { matches.add(i - j); j = lps[j - 1]; }
            else if (i < n && text.charAt(i) != pattern.charAt(j))
                j = (j != 0) ? lps[j - 1] : (++i == i ? 0 : 0);
        }
        return matches;
    }

    public static void main(String[] args) {
        System.out.println(kmpSearch("AABAACAADAABAABA", "AABA"));
    }
}`,
    },
  },

  rabinkarp: {
    javascript: {
      code: `function rabinKarp(text, pattern, prime = 101) {
  const n = text.length, m = pattern.length
  const BASE = 256
  let patHash = 0, winHash = 0, h = 1
  const matches = []

  for (let i = 0; i < m - 1; i++) h = (h * BASE) % prime
  for (let i = 0; i < m; i++) {
    patHash = (BASE * patHash + pattern.charCodeAt(i)) % prime
    winHash = (BASE * winHash + text.charCodeAt(i)) % prime
  }
  for (let i = 0; i <= n - m; i++) {
    if (patHash === winHash) {
      if (text.slice(i, i + m) === pattern) matches.push(i)
    }
    if (i < n - m) {
      winHash = (BASE * (winHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % prime
      if (winHash < 0) winHash += prime
    }
  }
  return matches
}

console.log(rabinKarp('ABCCDABCDABDC', 'ABCD'))`,
    },
    python: {
      code: `def rabin_karp(text, pattern, prime=101):
    n, m, BASE = len(text), len(pattern), 256
    pat_hash = win_hash = 0
    h = pow(BASE, m - 1, prime)
    matches = []

    for i in range(m):
        pat_hash = (BASE * pat_hash + ord(pattern[i])) % prime
        win_hash = (BASE * win_hash + ord(text[i])) % prime

    for i in range(n - m + 1):
        if pat_hash == win_hash and text[i:i+m] == pattern:
            matches.append(i)
        if i < n - m:
            win_hash = (BASE * (win_hash - ord(text[i]) * h) + ord(text[i + m])) % prime
            if win_hash < 0:
                win_hash += prime
    return matches

print(rabin_karp('ABCCDABCDABDC', 'ABCD'))`,
    },
    cpp: {
      code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> rabinKarp(const string& text, const string& pattern, int prime = 101) {
    int n = text.size(), m = pattern.size(), BASE = 256;
    long long patHash = 0, winHash = 0, h = 1;
    vector<int> matches;
    for (int i = 0; i < m - 1; i++) h = (h * BASE) % prime;
    for (int i = 0; i < m; i++) {
        patHash = (BASE * patHash + pattern[i]) % prime;
        winHash = (BASE * winHash + text[i]) % prime;
    }
    for (int i = 0; i <= n - m; i++) {
        if (patHash == winHash && text.substr(i, m) == pattern)
            matches.push_back(i);
        if (i < n - m) {
            winHash = (BASE * (winHash - text[i] * h) + text[i + m]) % prime;
            if (winHash < 0) winHash += prime;
        }
    }
    return matches;
}

int main() {
    for (int i : rabinKarp("ABCCDABCDABDC", "ABCD")) cout << i << " ";
}`,
    },
    java: {
      code: `import java.util.*;

public class RabinKarp {
    static List<Integer> rabinKarp(String text, String pattern, int prime) {
        int n = text.length(), m = pattern.length(), BASE = 256;
        long patHash = 0, winHash = 0, h = 1;
        List<Integer> matches = new ArrayList<>();
        for (int i = 0; i < m - 1; i++) h = (h * BASE) % prime;
        for (int i = 0; i < m; i++) {
            patHash = (BASE * patHash + pattern.charAt(i)) % prime;
            winHash = (BASE * winHash + text.charAt(i)) % prime;
        }
        for (int i = 0; i <= n - m; i++) {
            if (patHash == winHash && text.substring(i, i + m).equals(pattern))
                matches.add(i);
            if (i < n - m) {
                winHash = (BASE * (winHash - text.charAt(i) * h) + text.charAt(i + m)) % prime;
                if (winHash < 0) winHash += prime;
            }
        }
        return matches;
    }

    public static void main(String[] args) {
        System.out.println(rabinKarp("ABCCDABCDABDC", "ABCD", 101));
    }
}`,
    },
  },

  zalgorithm: {
    javascript: {
      code: `function zAlgorithm(s) {
  const n = s.length
  const z = new Array(n).fill(0)
  z[0] = n
  let l = 0, r = 0
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l])
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++
    if (i + z[i] > r) { l = i; r = i + z[i] }
  }
  return z
}

function zSearch(text, pattern) {
  const s = pattern + '$' + text
  const z = zAlgorithm(s)
  const m = pattern.length
  return z.slice(m + 1).reduce((acc, val, i) => {
    if (val === m) acc.push(i)
    return acc
  }, [])
}

console.log(zSearch('AABXAABXCAABXAABXAY', 'AABXAABD'))`,
    },
    python: {
      code: `def z_algorithm(s):
    n = len(s)
    z = [0] * n
    z[0] = n
    l, r = 0, 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return z

def z_search(text, pattern):
    s = pattern + '$' + text
    z = z_algorithm(s)
    m = len(pattern)
    return [i - m - 1 for i, val in enumerate(z) if i > m and val == m]

print(z_search('AABXAABXCAABXAABXAY', 'AABXAABD'))`,
    },
    cpp: {
      code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

vector<int> zAlgorithm(const string& s) {
    int n = s.size();
    vector<int> z(n, 0);
    z[0] = n;
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r) z[i] = min(r - i, z[i - l]);
        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) z[i]++;
        if (i + z[i] > r) { l = i; r = i + z[i]; }
    }
    return z;
}

vector<int> zSearch(const string& text, const string& pattern) {
    string s = pattern + "$" + text;
    auto z = zAlgorithm(s);
    int m = pattern.size();
    vector<int> matches;
    for (int i = m + 1; i < (int)s.size(); i++)
        if (z[i] == m) matches.push_back(i - m - 1);
    return matches;
}

int main() {
    for (int i : zSearch("AABXAABXCAABXAABXAY", "AABXAABD")) cout << i << " ";
}`,
    },
    java: {
      code: `import java.util.*;

public class ZAlgorithm {
    static int[] zAlgorithm(String s) {
        int n = s.length();
        int[] z = new int[n];
        z[0] = n;
        int l = 0, r = 0;
        for (int i = 1; i < n; i++) {
            if (i < r) z[i] = Math.min(r - i, z[i - l]);
            while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
            if (i + z[i] > r) { l = i; r = i + z[i]; }
        }
        return z;
    }

    static List<Integer> zSearch(String text, String pattern) {
        String s = pattern + "$" + text;
        int[] z = zAlgorithm(s);
        int m = pattern.length();
        List<Integer> matches = new ArrayList<>();
        for (int i = m + 1; i < s.length(); i++)
            if (z[i] == m) matches.add(i - m - 1);
        return matches;
    }

    public static void main(String[] args) {
        System.out.println(zSearch("AABXAABXCAABXAABXAY", "AABXAABD"));
    }
}`,
    },
  },
}
