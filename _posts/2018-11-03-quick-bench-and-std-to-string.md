---
layout: note
title: Benchmarking Strings with Quick C++ Benchmark
location: Manchester
category: research
published: true
description: Lorem ipsum
permalink: /quick-bench-std-to-string
asset_path: /assets/notes/quick-bench-to-string/
include_math: false
---

I recently traced an underperforming bit of C++ code to the construction of some
strings from a stringstream used to convert from an integer. This is a fairly 
common thing to see, as
stringstreams are flexible.
. Here's an example of the operation I'm talking about:

```cpp
#include <string>
#include <sstream>

int main()
{
  std::string x("prefix ");
  std::string y;
  for (int i = 0; i < 10; ++i)
  {
    std::ostringstream oss;
    oss << x << " " << i << std::endl;
    y = oss.str();
  }
}
```

Since C++11 we've had another way to do this without stringstreams using
[`std::to_string`][tostr], like this:

```cpp
#include <string>

int main()
{
  std::string x("prefix ");
  std::string y;
  for (int i = 0; i < 10; ++i)
  {
    y = x + std::to_string(i);
  }
}
```
I expect this to be faster because stringstreams are known to be slow, but how 
much faster? This is an example where I can quickly make and share a benchmark 
using [Quick C++ Benchmark][quickbench] by Fred Tingaud.

<figure>
<img class="text-framed" 
    src="{{ page.asset_path }}quick-bench-strings.png" />
<figcaption>Caption here.</figcaption>
</figure>

Different compilers.

I'd like it to support MSVC.

[tostr]: https://en.cppreference.com/w/cpp/string/basic_string/to_string
[quickbench]: http://quick-bench.com/C4Vum-_COfMaFTPzZCFgH3cpbxI
