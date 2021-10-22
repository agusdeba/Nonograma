:- module(proylcc,
	[  
		put/8
	]).

:-use_module(library(lists)).


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% replace(?X, +XIndex, +Y, +Xs, -XsY)
%
% XsY es el resultado de reemplazar la ocurrencia de X en la posición XIndex de Xs por Y.

replace(X, 0, Y, [X|Xs], [Y|Xs]).

replace(X, XIndex, Y, [Xi|Xs], [Xi|XsY]):-
    XIndex > 0,
    XIndexS is XIndex - 1,
    replace(X, XIndexS, Y, Xs, XsY).

% Retorna X, siendo este el elemento/lista que necesitas.
% getActual(Pos,ListaABuscarPos,Retorno)
getActual(0,[X|_Xs],X).
getActual(N,[_X|Xs],Ret):- N2 is N-1, getActual(N2,Xs,Ret).

% Obtenes la columna que necesitas.
%getCol(ColN,newGrilla,ColRet).
getCol(_N,[],[]).
getCol(N,[X|Xs],[Elem|ColRet]):- getCol(N,Xs,ColRet), getActual(N,X,Elem).

% verificar(Pista,ListaAControlar,ListaAControlarReducida)
verificarPista(0,[],[]).
verificarPista(0, [X|Xs] ,Xs):- X\=="#".
verificarPista(N,[X|Xs],Ret):- X=="#" , N\=0, N2 is N-1 , verificarPista(N2,Xs,Ret).

% controlarSat(Pistas,ListaMovida).
controlarSat([],[Y|Ys]):- Y\=="#" , controlarSat([],Ys).
controlarSat([],[]).
controlarSat([X|Xs],[Y|Ys]):- Y=="#" , (verificarPista(X,[Y|Ys],Red), controlarSat(Xs,Red)).
controlarSat([X|Xs],[Y|Ys]):- Y\=="#", controlarSat([X|Xs],Ys).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%
% put(+Contenido, +Pos, +PistasFilas, +PistasColumnas, +Grilla, -GrillaRes, -FilaSat, -ColSat).
%

put(Contenido, [FilaN, ColN], PistasFilas, PistasColumnas, Grilla, NewGrilla, FilaSat, ColSat):-
	% NewGrilla es el resultado de reemplazar la Fila en la posición RowN de Grilla
	% (FilaN-ésima fila de Grilla), por una fila nueva NewFila.
	
	replace(Fila, FilaN, NewFila, Grilla, NewGrilla),

	% NewFila es el resultado de reemplazar la celda Cell en la posición ColN de Fila por _,
	% siempre y cuando Cell coincida con Contenido (Cell se instancia en la llamada al replace/5).
	% En caso contrario (;)
	% NewFila es el resultado de reemplazar lo que se que haya (_Cell) en la posición ColN de Fila por Conenido.	 
	
	(replace(Cell, ColN, _, Fila, NewFila),
	    Cell == Contenido;
	    replace(_Cell, ColN, Contenido, Fila, NewFila)),
	
	%Controlar si se satisface las pistas de fila.
	( getActual(FilaN,PistasFilas,PistaF), 
	 FilaSat is 1, controlarSat(PistaF,NewFila); FilaSat is 0 ),
	
	%Controlar si se satisface las pistas de columna
	( getCol(ColN,NewGrilla,ColRet) , getActual(ColN,PistasColumnas,PistaC) ,
	 ColSat is 1, controlarSat(PistaC,ColRet) ; ColSat is 0 ).


	



