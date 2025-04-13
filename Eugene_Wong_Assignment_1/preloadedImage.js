TRIANGLE = 1;


const preloadedImages = {
    "dragon": [
  {
    type: TRIANGLE,
    position: [-0.235, -0.245],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 40,
    vertex1Offset: [1.500, 0.000],
    vertex2Offset: [0.000, -3.000]
  },
  {
    type: TRIANGLE,
    position: [0.055, -0.825],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 40,
    vertex1Offset: [-1.500, 0.000],
    vertex2Offset: [0.000, 3.000]
  },
  {
    type: TRIANGLE,
    position: [-0.090, -0.270],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 33,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [0.035, -0.120],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 33,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, 0.500]
  },
  {
    type: TRIANGLE,
    position: [0.040, -0.050],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 20,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 5.000]
  },
  {
    type: TRIANGLE,
    position: [0.135, 0.420],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 20,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, -5.000]
  },
  {
    type: TRIANGLE,
    position: [-0.350, 0.425],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 20,
    vertex1Offset: [5.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [0.085, 0.520],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 20,
    vertex1Offset: [-5.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [0.085, 0.520],
    color: [0.690, 0.510, 0.440, 1.000],
    size: 20,
    vertex1Offset: [-5.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.090, -0.260],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, 1.500]
  },
  {
    type: TRIANGLE,
    position: [0.190, -0.125],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, -1.500]
  },
  {
    type: TRIANGLE,
    position: [0.135, -0.135],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 7.000]
  },
  {
    type: TRIANGLE,
    position: [0.235, 0.545],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, -7.000]
  },
  {
    type: TRIANGLE,
    position: [0.160, -0.040],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [0.155, -0.040],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [0.040, -0.125],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [0.150, 0.535],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [0.085, 0.420],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [0.150, 0.510],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 20,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.335, 0.515],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 29,
    vertex1Offset: [4.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [0.155, 0.670],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 29,
    vertex1Offset: [-4.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.345, 0.715],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 29,
    vertex1Offset: [2.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.560, 0.705],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 29,
    vertex1Offset: [2.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.780, 0.695],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 29,
    vertex1Offset: [2.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.545, 0.560],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 29,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.330, 0.575],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 29,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.770, 0.680],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 19,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.360, 0.695],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 19,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.350, 0.695],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 19,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -2.000]
  },
  {
    type: TRIANGLE,
    position: [-0.355, 0.690],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 19,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.355, 0.780],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 19,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.065, 0.705],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 19,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.155, 0.870],
    color: [0.220, 0.290, 0.300, 1.000],
    size: 19,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.350, 0.595],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 19,
    vertex1Offset: [2.500, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.355, 0.510],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 19,
    vertex1Offset: [2.500, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.770, 0.505],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 19,
    vertex1Offset: [5.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.345, 0.425],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 19,
    vertex1Offset: [-5.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.755, 0.485],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.630, 0.495],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.480, 0.495],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.755, 0.565],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.625, 0.560],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.475, 0.575],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.540, 0.490],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.685, 0.495],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.540, 0.490],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.680, 0.570],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.535, 0.580],
    color: [0.660, 0.640, 0.630, 1.000],
    size: 13,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [0.050, -0.255],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 33,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -5.000]
  },
  {
    type: TRIANGLE,
    position: [0.210, -1.000],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 33,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, 5.000]
  },
  {
    type: TRIANGLE,
    position: [0.210, -1.000],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 33,
    vertex1Offset: [-1.000, 0.000],
    vertex2Offset: [0.000, 5.000]
  },
  {
    type: TRIANGLE,
    position: [0.575, -1.000],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 26,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, 7.000]
  },
  {
    type: TRIANGLE,
    position: [0.190, -0.095],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 26,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, -7.000]
  },
  {
    type: TRIANGLE,
    position: [-0.300, 0.700],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 26,
    vertex1Offset: [1.000, 0.000],
    vertex2Offset: [0.000, -1.000]
  },
  {
    type: TRIANGLE,
    position: [0.565, -1.005],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 35,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, 2.000]
  },
  {
    type: TRIANGLE,
    position: [1.015, -0.680],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 35,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, -2.000]
  },
  {
    type: TRIANGLE,
    position: [0.060, -0.800],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 22,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, -2.000]
  },
  {
    type: TRIANGLE,
    position: [-0.255, -0.995],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 22,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, 2.000]
  },
  {
    type: TRIANGLE,
    position: [-0.775, -0.990],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 36,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, 5.000]
  },
  {
    type: TRIANGLE,
    position: [-0.250, -0.115],
    color: [0.580, 0.640, 0.630, 1.000],
    size: 36,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, -5.000]
  },
  {
    type: TRIANGLE,
    position: [0.510, -0.110],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 19,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, 5.000]
  },
  {
    type: TRIANGLE,
    position: [0.500, 0.905],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 23,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, -5.000]
  },
  {
    type: TRIANGLE,
    position: [0.500, -0.105],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 28,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, 7.500]
  },
  {
    type: TRIANGLE,
    position: [0.910, 0.900],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 28,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, -7.500]
  },
  {
    type: TRIANGLE,
    position: [0.565, -0.095],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 25,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, -3.000]
  },
  {
    type: TRIANGLE,
    position: [0.565, -0.105],
    color: [0.640, 0.500, 0.470, 1.000],
    size: 19,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, -3.000]
  },
  {
    type: TRIANGLE,
    position: [0.575, -0.120],
    color: [0.640, 0.500, 0.470, 1.000],
    size: 19,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, 5.000]
  },
  {
    type: TRIANGLE,
    position: [0.565, 0.840],
    color: [0.640, 0.500, 0.470, 1.000],
    size: 19,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, -5.000]
  },
  {
    type: TRIANGLE,
    position: [0.560, -0.110],
    color: [0.640, 0.500, 0.470, 1.000],
    size: 19,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, 10.000]
  },
  {
    type: TRIANGLE,
    position: [0.830, 0.820],
    color: [0.640, 0.500, 0.470, 1.000],
    size: 19,
    vertex1Offset: [-3.000, 0.000],
    vertex2Offset: [0.000, -10.000]
  },
  {
    type: TRIANGLE,
    position: [0.170, 0.895],
    color: [0.440, 0.500, 0.470, 1.000],
    size: 19,
    vertex1Offset: [3.000, 0.000],
    vertex2Offset: [0.000, 1.000]
  },
  {
    type: TRIANGLE,
    position: [-0.765, -1.005],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 40,
    vertex1Offset: [10.000, 0.000],
    vertex2Offset: [0.000, 2.000]
  },
  {
    type: TRIANGLE,
    position: [-0.765, -1.010],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 40,
    vertex1Offset: [2.000, 0.000],
    vertex2Offset: [0.000, -2.000]
  },
  {
    type: TRIANGLE,
    position: [-0.755, -0.820],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 19,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, -2.000]
  },
  {
    type: TRIANGLE,
    position: [-0.765, -0.825],
    color: [0.000, 0.000, 0.000, 1.000],
    size: 19,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [-0.585, -0.640],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [-0.425, -0.680],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [-0.300, -0.695],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [-0.225, -0.730],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [-0.095, -0.760],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.010, -0.775],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.095, -0.790],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.190, -0.810],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.280, -0.840],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.390, -0.855],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.475, -0.875],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.575, -0.895],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.680, -0.910],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.680, -0.910],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.760, -0.935],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.880, -0.940],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [0.880, -0.940],
    color: [0.470, 0.550, 0.570, 1.000],
    size: 11,
    vertex1Offset: [-2.000, 0.000],
    vertex2Offset: [0.000, 2.500]
  },
  {
    type: TRIANGLE,
    position: [-0.360, 0.740],
    color: [0.900, 0.890, 0.000, 1.000],
    size: 7,
    vertex1Offset: [2.500, 0.000],
    vertex2Offset: [0.000, -2.000]
  },
  {
    type: TRIANGLE,
    position: [-0.360, 0.740],
    color: [0.900, 0.890, 0.000, 1.000],
    size: 7,
    vertex1Offset: [2.500, 0.000],
    vertex2Offset: [0.000, -2.000]
  },
  
    ]
  };