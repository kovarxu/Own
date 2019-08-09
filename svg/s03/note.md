## feDisplacementMap

this filter is used to create an effect named as displacement map

steps:

1. we need an feImage element
2. desaturate background to gray
3. blur the result of 1
4. use feDisplaymentMap to distort the source text. After this step, the bg will be invisible
5. we still need the bg so redefine the bg again
6. use feColorMatrix to decrease alpha of the result of 3
7. use feBlend + multiply mode to blend result of step4 and step5
8. merge the result of step 4 and step 7

something different between browsers:

1. chrome and firefox must get page from the Internet, not local files
2. MSEdge can take local files as source
