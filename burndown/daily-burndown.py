import numpy as np
from matplotlib import pyplot as plt
import sys

if len(sys.argv)==1:
    print("\nError, usage: python daily-burndown.py burndown.txt\n"+
            "burndown.txt should have the format\n"+
            "day points\n" +
            "day points...\n")

else:
    dat = np.loadtxt(sys.argv[1])
    if len(np.shape(dat))==1: #1 dimension
        print("\nOnly initial data is provided, a chart is not possible\n")

    else:
        iterations = dat[:,0]
        points = dat[:,1]

        plt.figure(figsize=(14,14))
        plt.xlabel(r'Days',fontsize=24)
        plt.ylabel(r'Hours',fontsize=24)
        plt.tick_params(labelsize=20)

        plt.plot(iterations,points,'.-',lw=2,ms=15,label='data')

        current = points[-1]
        if (current > 0):
            error = 0
            prev = -2
            velocity = 0

            while velocity <= 0:
                if -1*prev > len(dat):
                    print("\nNo positive progress has been made.\nIt is not possible to predict a completion time.\n")
                    error = 1
                    break

                velocity = points[prev] - current
                current = points[prev]
                prev = prev - 1

            if not error:
                xintercept = iterations[-1] + points[-1]/velocity
                prediction = np.array([[iterations[-1], points[-1]],[xintercept,0]])
                plt.plot(prediction[:,0],prediction[:,1],'b--',lw=2,ms=15,label='prediction')

        for point in range(len(points))[1:]:
            if points[point]!=points[point-1]:
                if point==len(points)-1 or points[point] > points[point+1]:
                    plt.text(iterations[point], points[point]+1,str(int(points[point])),fontsize=16)
                else:
                    plt.text(iterations[point], points[point]-2,str(int(points[point])),fontsize=16)

        plt.legend(fontsize=24) 
        plt.savefig("daily-burndown.png")
        plt.show()
