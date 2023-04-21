	# var inputx = something;
	# var inputy = something else;
	# var inputz = another something;

	# var inputa = rotational input of awesomeness
	# var input b = spinny
	# var input c = hypothetical?? input


	# //MATH NOT SHOWN???

	# var totalbitofpowerused = that math that wasnt shown
	# var totalbitofpowerusedprecent = totalbitofpowerused/20
	# // that math that wasnt shown should be less than or equal to 20

	# // mathe war nicht schreiben

	# var precentforward = mathe war nicht schreiben 1
	# var precentrotate = mathe war nicht schreiben 2

	# var xrotate = //math that finds how much to rotate on x direction (%)
	# var yrotate = see above
	# var zrotate = see above

	# var xforward = //math that finds how much moving in x direction (%)
	# var yforward = above
	# var zforward = avode

	# var x = ((precentrotate * xrotate) + (xforward * precentforward)) // precent of x motor moving

class inputDiffusion:
	# directional
	inputXdir = 0
	inputYdir = 0
	inputZdir = 0
	# rotational
	inputXrot = 0
	inputYrot = 0
	# inputZrot = 0		potentially uncapable
	def	thrAxisX(inputXdir):
		thrX1=inputXdir		# left forward thruster
		thrX2=inputXdir		# right forward thruster
		return(thrX1,thrX2)
	def thrAxisY(inputYdir,inputXrot):
		thrY1=(inputYdir+inputXrot)		# left upward thruster
		thrY2=(inputYdir-inputXrot)		# right upward thruster
		return(thrY1,thrY2)