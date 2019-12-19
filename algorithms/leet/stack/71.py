#!/usr/bin/env python
#encoding: utf-8

# 49.77% / 99.72%

class Solution:
  def simplifyPath(self, path: str) -> str:
    if (path[-1] != '/'): path = path + '/'
    stack, i, j, l = [], 0, 1, len(path)
    while j < l and i < l:
      if (path[i] == '/'):
        i += 1
        continue
      if (j < i): j = i + 1
      if (j == l or path[j] == '/'):
        word = path[i:j]
        if (word == '.'):
          pass
        elif (word == '..'):
          len(stack) > 0 and stack.pop()
        else:
          stack.append(word)
        i = j
      j += 1
    return '/' + '/'.join(stack)

if (__name__ == '__main__'):
  s = Solution()
  result = s.simplifyPath('/home/')
  print(result)
  