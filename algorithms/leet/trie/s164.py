#!/usr/bin/env python
#encoding: utf-8

# input: a list of words and a wanted word
# output: step list for the word
class Node:
  def __init__(self):
    self.words = []
    self.cmap = {}

def buildTrie(root, word):
  tmp = root
  tmp.words.append(word)
  for c in word:
    if (not c in tmp.cmap):
      tmp.cmap[c] = Node()
    tmp = tmp.cmap[c]
    tmp.words.append(word)

class Solution:
  def build(self, words):
    self.root = Node()
    for word in words:
      buildTrie(self.root, word)

  def slove(self, wanting):
    tmp = self.root
    for c in wanting:
      n = tmp.cmap.get(c)
      if (n):
        print(n.words)
        tmp = n
      else:
        print([])
        break

if (__name__ == '__main__'):
  words = ['cat', 'act', 'cate', 'cayon', 'cab', 'gooes', 'go', 'does']
  wanting = 'good'

  s = Solution()
  s.build(words)
  print(s)
  s.slove(wanting)

