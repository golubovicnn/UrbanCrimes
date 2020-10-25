1.
WHAT: 
In first part I did the map view, with 'Arreste Home City - Mapped' as circles and connected them with Urbana Coordinates, showing all places in USA where Arestee came from.
HOW: 
I took the 'Arrestee home city' column, splited it, and then added in both longitude and latitude array. I made circles to show excact coordinates of the home city. Longitude array was 'cx' attribute and latitude was 'cy'. Then, I connected it with lines. 

2.
WHAT: 
Second part is bar chart, showing number of crimes per sex. 
HOW: 
I counted the number of crimes for both sex and put them in separate variables. Then, simply, created bars for both.

3.
WHAT:
Third is Histogram, showing number of records over the years. The difference between histogram and bar chart is that on histogram, bars width is wide according to number of records. 
HOW:
First, I put years in one array and convert them to numeric. Then, made bars and set width with formel count divided by sum of number of records.

4.
WHAT:
At the end, there is scatter plot. Its showing us how far are arrestees home cities from urbana. On the left side are km, below are years. Circles are home cities. Below the scatter plot there is so called "Brushing", which is interactive and let us change the range of time for showed cities.
HOW:
I put data for scatter plot in one array, which has date and distance. Distance was calculated in one separate function called 'calculateDistance'. Last tutorium helped me at brushing part. It was very well explained and I didn't have difficultes to manage it.
