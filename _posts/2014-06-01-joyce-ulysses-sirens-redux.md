---
num:        "017"
cat:        projects
title:      "Visualizing Joyce's Ulysses: &quot;Sirens&quot; as a Graphic Score"
path:       joyce-ulysses-sirens-redux
images:
  - src:    post-017_imgs/01.png
    class:  post-img
    width:  750
    height: 423
  - src:    post-017_imgs/02.png
    class:  post-img
    width:  750
    height: 407
cred:
  - name:   "2014 Kantar Information is Beautiful Awards: Longlist"
    link:   "http://www.informationisbeautifulawards.com/showcase?acategory=interactive&award=2014&pcategory=long-list"
  - name:   "Columbia University Group for Experimental Methods in the Humanities"
    link:   "http://xpmethod.plaintext.in/theory-method/visualizing-joyce.html"
tags:
  - dynamic
  - text
---
[view here](/x/sirens)

In reference to schemas for _Ulysses_, Joyce describes the compositional technique behind the "Sirens" episode as a "_fugue_ with all musical notations," and as including the "eight regular parts of a _fuga per canonem_." While the actual structure of the episode is unresolved, this project is an attempt to track and classify all of the sounds that comprise it, and depict them as a graphic score.

Joyce uses the first 63 lines of the chapter to introduce 99 words and syllables that reappear in different forms throughout the rest of the text. The sounds ultimately act as [leitmotifs](http://en.wikipedia.org/wiki/Leitmotif), evoking the sensory presence of different characters at different times.

This visualization is constructed as a line-by-line annotation of each sound that recurs at least four times following its initial introduction. Within each line, each sound is grouped into repetitions, linked to its associated character(s), and sorted into one of three possible tiers based on its distance from the root sound. The lines are represented as columns.

The final project is [here](/x/sirens).

The word frequency dataset I used to build it is [here](/x/sirens/data/freq.csv).<br>
The basic character/sound framework I constructed for it is [here](/x/sirens/imgs/tree.png).<br>
The full “Sirens” text is [here](/x/sirens/data/sirens.txt).

This project is the second manifestation of a [previous one](/projects/joyce-ulysses-sirens-visualization.html).

Built using Processing (for help constructing the dataset) and D3.js.