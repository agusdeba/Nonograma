
:- module(init, [ init/3 ]).

init(
[[3], [1,2], [4], [5], [5]],	% PistasFilas

[[2], [5], [1,3], [5], [4]], 	% PistasColumnas

[["X", _ , _ , _ , _ ],		
 ["X", _ ,"X", _ , _ ],
 ["X", _ , _ , _ , _ ],		% Grilla
 ["#","#","#", _ , _ ],
 [ _ , _ ,"#","#","#"]
]
).
