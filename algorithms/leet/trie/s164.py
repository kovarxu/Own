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
  for c in word:
    tmp.words.append(word)
    if (not c in tmp.cmap):
      tmp.cmap[c] = Node()
    tmp = tmp.cmap[c]

class Solution:
  def build(self, words):
    self.root = Node()
    for word in words:
      buildTrie(self.root, word)

  def slove(self, wanting):
    tmp = self.root
    for c in wanting:
      n = tmp.cmap[c]
      if (n):
        print(n.words)
        tmp = n
      else:
        print('not found')
        break

if (__name__ == '__main__'):
  words = ['cat', 'act', 'cate', 'cayon', 'cab', 'gooes', 'go', 'does']
  wanting = 'cat'

  s = Solution()
  s.build(words)
  print(s)
  s.slove(wanting)

