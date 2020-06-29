---
layout: note
title: Benchmarking String Conversion in C++
location: Manchester
category: research
published: true
description: Lorem ipsum
permalink:
asset_path: /assets/notes/benchmarking-string-coversion-in-cpp/
include_math: false
---

I recently traced an underperforming routine in a C++ application to the
construction of some strings from a stringstream used in this case to convert
from an integer. This is a fairly common thing to see as stringstreams are
flexible for converting from different types. Here's an example of the operation
I'm talking about.

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
    oss << x << " " << i;
    y = oss.str();
  }
}
```

First I could see that the stringstream did not need to be constructed in the
loop, but also since C++11 we've had another way to do this using
[`std::to_string`][tostr]. Here's the same task done this modern way, without
stringstreams.

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
I expect this to be faster because it requires no construction in the loop and
stringstreams are known to be slow, but how much faster? This is an example
where I can quickly make and share a benchmark using [Quick C++
Benchmark][quickbench] by Fred Tingaud.

<figure>
<a href="http://quick-bench.com/QJoZTFsTxiP3I-1tOkVC4SzNsqU">
<img class="text" 
    src="{{ page.asset_path }}QJoZTFsTxiP3I-1tOkVC4SzNsqU.png" />
</a>
<figcaption>The <code>std::to_string</code> conversion is 4.5&times; faster.
</figcaption>
</figure>

The tool allows you to select different compilers, C++ standards and
optimisation levels. It doesn't support MSVC unfortunately, but Clang and
GCC are available.

In summary, using `to_string` is faster here than stringstream conversion and
[Quick C++ Benchmark][quickbench] is a useful tool for benchmarking C++ code.

[tostr]: https://en.cppreference.com/w/cpp/string/basic_string/to_string
[quickbench]: http://quick-bench.com/QJoZTFsTxiP3I-1tOkVC4SzNsqU
