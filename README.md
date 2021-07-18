# Sudoku-Solver
#This is an implementation of constraint propagation algorithm for sudoku solving.<br>
#This is completely implemented on core javascript<br>
--currently working branch is 'third' branch and 'working-branch' where the latter is branched out from 'third'<br>
--branch 'fourth' and 'fifth' has been deleted and 'sixth' is kept as remnant of works done in those two branch

### You can simply change the file extension of index.php to index.html because there's no php used in this project
#### Edit: to run test (which processes sudoku in top95.txt and gives max, min and avg stats) a php server needs to be run on the root folder
### getSudoku.js is supposed to be a Sudoku generator but it is not implemented

##### Lists of variables
1. sudoku grid: a 9*9 matrix

							0-----1-----0-----4-----0-----9-----0-----0-----0
							|     |     |     |     |     |     |     |     |
							0-----0-----4-----0-----0-----0-----3-----0-----5
							|     |     |     |     |     |     |     |     |
							0-----8-----0-----3-----0-----0-----0-----7-----0
							|     |     |     |     |     |     |     |     |
							3-----0-----0-----6-----0-----7-----1-----0-----9
							|     |     |     |     |     |     |     |     |
							0-----0-----0-----0-----0-----0-----0-----0-----0
							|     |     |     |     |     |     |     |     |
							6-----0-----9-----5-----0-----3-----0-----0-----2
							|     |     |     |     |     |     |     |     |
							0-----7-----0-----0-----0-----5-----0-----6-----0
							|     |     |     |     |     |     |     |     |
							9-----0-----5-----0-----0-----0-----4-----0-----0
							|     |     |     |     |     |     |     |     |
							0-----0-----0-----0-----0-----6-----0-----9-----0

2. row_units: it is shown in sudoku below. It is a 1*9 sub matrix 
3. col_units: it is shown in sudoku below. It is a 9*1 sub matrix
4. box_units: it is shown in sudoku below. It is a 3*3 sub matrix

3. peers: for cell (1,1) in the sudoku below, its peers are row 1, column 1 and box 1 because that's where its value effects others and others value effects it


						column ->   1	  2     3     4		5     6     7     8     9	 

						row 1:		0-----1-----0-----4-----0-----9-----0-----0-----0
								|     |     |     |     |     |     |     |     |
						row 2:		0---box 1---4-----0---box 2---0-----3---box 3---5
								|     |     |     |     |     |     |     |     |
						row 3:		0-----8-----0-----3-----0-----0-----0-----7-----0
								|     |     |     |     |     |     |     |     |
						row 4:		3-----0-----0-----6-----0-----7-----1-----0-----9
								|     |     |     |     |     |     |     |     |
						row 5:		0---box 4---0-----0---box 5---0-----0---box 6---0
								|     |     |     |     |     |     |     |     |
						row 6:		6-----0-----9-----5-----0-----3-----0-----0-----2
								|     |     |     |     |     |     |     |     |
						row 7:		0-----7-----0-----0-----0-----5-----0-----6-----0
								|     |     |     |     |     |     |     |     |
						row 8:		9---box 7---5-----0---box 8---0-----4---box 9---0
								|     |     |     |     |     |     |     |     |
						row 9:		0-----0-----0-----0-----0-----6-----0-----9-----0


##### Lists of Functions   (variable names are written as _name_)
 1.	initializeEmptyGrid() : it initializes _sudoku_grid_ to 9*9 zero matrix
 2. clearPreviousSolution() : It simply clears variables _sudoku_grid_, _row_unit_, _col_unit_, _box_unit_, _peers_, _complete_trace_, _choice_trace_, _propagation_trace_
 3. useDemoInput() : initializes _sudoku_grid_ with a test sudoku
 4. displaySudokuInConsole(): used for debug purpose, it displays _sudoku_grid_ matrix in visually comprehensible format in console.
 5. initialzeUnits() : initializes _row_unit_, _col_unit_ and _box_unit_
 6. initializePeers() : initializes _peers_
 7. initializeConstraint() : once the input sudoku is set then it should be called to initialize _constraints_ i.e. to know which possible choices are left in empty cells
 8. initialPropagation() : it is called by initializeConstraint() to initialize _consttraints_. It propagates the constraint to the peers of cell withh inputs.
 9. forwardPropagation(row_index,column_index,value) : whenever a choice is made, represented by parameter value, this function propagates the effect of that choice i.e. value
				row_index and column_index identifies the cell where the choice is made and thus tells the function the direction of propagation
 10. backwardPropagation() : when a choice made doesn't lead to solution, the actions have to be backtracked. It uses _propagation_trace_ stack to revert the effect of the choice
 11. minimumConstraint() : searches for the cell in the sudoku_grid with minimum number of options left, returns the array of position with minimun constraint for that instance
 12. solutionFinder() : It is a recursive function. Once the input is set and all the units, peers and constraints are initialized then it works recursively to find the solution.
				it exhausts all the possible the search space to find the solution. 
				It selectes cell with minimum constraint randomly so the number of steps to solution differs on each run.
 13. checkAllFilled() : it checks if all the cells in sudoku is filled or not. If filled returns true that indicates that the solution has been found
 14. solve() : Though solutionFinder() is the one that searches for the solution, one should call solve() as it does initialization and  check for criteria of unique solution
				before diving into the searching of solution.

 15/16. updateSudoku_grid(row_index,column_index,value) && inputSudokuValidator(row_index,column_index,value) are two functions that can be used by those who want to
			implement different UI but don't want to bother with implementing the algorithm.

			==> updateSudoku_grid() inserts value in cell(row_index,column_index)
			==> after updateSudoku_grid() call inputSudokuValidator()
			==> inputSudokuValidator() checks if the input is valid or not. 
			==> returns 'success' if its ok otherwise returns a string with conflict information which is consoled in this implementation (index.php)
