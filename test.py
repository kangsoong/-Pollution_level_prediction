import numpy as np
import pandas as pd
from numpy import array
from numpy import hstack
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm

% matplotlib
inline
% config
InlineBackend.figure_format = 'retina'

from keras.models import Sequential
from keras.layers import Dense, LSTM
from keras.utils import np_utils