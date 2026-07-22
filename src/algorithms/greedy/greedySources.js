export const greedySources = {

  activitySelection: {
    javascript: {
      code: `
function activitySelection(start, end) {
  let activities = [];

  for (let i = 0; i < start.length; i++) {
    activities.push([start[i], end[i]]);
  }

  activities.sort((a, b) => a[1] - b[1]);

  let count = 1;
  let lastEnd = activities[0][1];

  for (let i = 1; i < activities.length; i++) {
    if (activities[i][0] >= lastEnd) {
      count++;
      lastEnd = activities[i][1];
    }
  }

  return count;
}
`,
    },

    java: {
      code: `
import java.util.*;

public class ActivitySelection {

    static int activitySelection(int[] start, int[] end) {

        int n = start.length;
        int[][] activities = new int[n][2];

        for(int i=0;i<n;i++){
            activities[i][0] = start[i];
            activities[i][1] = end[i];
        }

        Arrays.sort(activities, (a,b)->a[1]-b[1]);

        int count = 1;
        int lastEnd = activities[0][1];

        for(int i=1;i<n;i++){

            if(activities[i][0] >= lastEnd){
                count++;
                lastEnd = activities[i][1];
            }
        }

        return count;
    }
}
`,
    },
  },


  fractionalKnapsack: {

    javascript: {
      code: `
function fractionalKnapsack(weights, values, capacity){

  let items = [];

  for(let i=0;i<weights.length;i++){
    items.push({
      weight: weights[i],
      value: values[i],
      ratio: values[i]/weights[i]
    });
  }


  items.sort((a,b)=>b.ratio-a.ratio);


  let total = 0;

  for(let item of items){

    if(capacity >= item.weight){

      capacity -= item.weight;
      total += item.value;

    }else{

      total += item.ratio * capacity;
      break;

    }
  }


  return total;
}
`,
    },


    java:{
      code:`
import java.util.*;

class FractionalKnapsack {

    static double solve(int[] weight,int[] value,int capacity){

        int n = weight.length;

        double[][] items = new double[n][2];


        for(int i=0;i<n;i++){

            items[i][0]=weight[i];
            items[i][1]=value[i];

        }


        Arrays.sort(items,(a,b)->
            Double.compare(
            b[1]/b[0],
            a[1]/a[0])
        );


        double result=0;


        for(int i=0;i<n;i++){

            if(capacity >= items[i][0]){

                capacity -= items[i][0];
                result += items[i][1];

            }
            else{

                result += (items[i][1]/items[i][0])*capacity;
                break;

            }
        }


        return result;
    }
}
`,
    },

  },


};


export const getGreedySource = (algo, language) =>
  greedySources[algo]?.[language]?.code ??
  '// No implementation available';