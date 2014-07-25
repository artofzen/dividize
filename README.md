dividize
========

Convert an HTML table to a responsive DIV structure

<p>Dividize takes the following options:
<ul>
<li><b>customHeaderTarget</b> (default : 'th') - If the table is not using th for its header cells, you can target other cells (e.g 'table > tr:first-child td' ).</li>
<li><b>addLabelHeaders</b> (default : false) - Add appropriate header elements to each created div cell.</li>
<li><b>hideLabels</b> (default : true) - Hide the above label headers in our div structure.</li>
<li><b>removeHeaders</b> (default : false) - Do not recreate the original headers in our div structure.</li>
<li><b>preserveEvents</b> (default : false) - Save events from elements in the table and apply them to the recreated elements in ours (Does not save events on table, thead, tbody, tfoot, th, tr, td).</li>
<li><b>preserveDim</b> (default : false) - Keep the table cell dimensions for our div cells.</li>
<li><b>classes</b> (default : '') - Add any extra classes to our root div element.</li>
<li><b>enableAltRows</b> (default : false) - Mark our rows with classes even/odd for css selectors</li>
</ul>
</p>
