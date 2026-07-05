export const ML_ALGORITHMS = [
  {
    id: 'linear_regression',
    name: 'Linear Regression',
    category: 'Supervised Learning (Regression)',
    desc: 'Predicts a continuous target value by modeling a linear relationship between input features and target variables.',
    formula: 'y = w_1 x_1 + w_2 x_2 + ... + b',
    sklearn: `from sklearn.linear_model import LinearRegression\n\n# Initialize and fit\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Predict\npredictions = model.predict(X_test)`,
    svgType: 'linear',
    extendedContent: {
      intro: {
        title: "What is Linear Regression?",
        desc: "Linear regression is a statistical method used to model the relationship between two variables: an independent variable (predictor, X) and a dependent variable (response, Y).",
        simpleFormula: "Y = β₀ + β₁X + ε",
        multipleFormula: "Y = β₀ + β₁X₁ + β₂X₂ + ··· + βₙXₙ + ε",
        simpleDesc: "In Simple Linear Regression, we find a 2D line (e.g., modeling Salary vs. Years of Experience).",
        multipleDesc: "Multiple Linear Regression extends this to two or more independent variables."
      },
      assumptions: [
        { name: "Linearity", desc: "The relationship between the independent and dependent variables must be linear." },
        { name: "Independence", desc: "The observations must be independent of each other (no autocorrelation)." },
        { name: "Homoscedasticity", desc: "The variance of residual errors should be constant across all levels of the independent variables." },
        { name: "Normality", desc: "The residuals (errors) should be approximately normally distributed." },
        { name: "No Multicollinearity", desc: "The independent variables should not be highly correlated with each other." }
      ],
      howItWorks: {
        title: "How does it work?",
        steps: [
          { name: "Hypothesis Function", desc: "The model defines a linear equation that best predicts the output." },
          { name: "Cost Function", desc: "Usually Mean Squared Error (MSE), it measures how far the predictions are from actual values." },
          { name: "Gradient Descent", desc: "An optimization algorithm used to update coefficients and minimize the Cost Function iteratively." }
        ]
      },
      proscons: {
        advantages: [
          "Easy to implement, interpret, and very efficient to train.",
          "Performs well when the dataset is linearly separable.",
          "Extrapolates well beyond the training data if the trend is truly linear."
        ],
        disadvantages: [
          "Assumes a linear relationship, which is often not true in real-world scenarios.",
          "Highly sensitive to outliers, which can drastically shift the regression line.",
          "Prone to multicollinearity, leading to unreliable coefficients."
        ]
      }
    }
  },
  {
    id: 'multiple_linear_regression',
    name: 'Multiple Linear Regression',
    category: 'Supervised Learning (Regression)',
    desc: 'Models a continuous target using two or more independent features, capturing the combined linear effect of multiple predictors.',
    formula: 'Y = β₀ + β₁X₁ + β₂X₂ + ... + βₙXₙ + ε',
    sklearn: `from sklearn.linear_model import LinearRegression

# Initialize and fit
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)`,
    svgType: 'multiple',
    extendedContent: {
      intro: {
        title: "What is Multiple Linear Regression?",
        desc: "Multiple linear regression estimates the relationship between one dependent variable Y and several independent variables X₁, X₂, ..., Xₙ.",
        simpleFormula: "Y = β₀ + β₁X + ε",
        multipleFormula: "Y = β₀ + β₁X₁ + β₂X₂ + ··· + βₙXₙ + ε",
        simpleDesc: "Simple linear regression uses one predictor and learns one slope coefficient.",
        multipleDesc: "Multiple linear regression extends this to many predictors, each with its own coefficient."
      },
      assumptions: [
        { name: "Linearity", desc: "The target variable should have a linear relationship with each predictor, individually and collectively." },
        { name: "No Multicollinearity", desc: "Predictor variables should not be highly correlated with each other." },
        { name: "Independence", desc: "Observations should be independent and not autocorrelated." },
        { name: "Homoscedasticity", desc: "Residuals should have constant variance across all fitted values." },
        { name: "Normality", desc: "Residuals should be approximately normally distributed." }
      ],
      howItWorks: {
        title: "How does it work?",
        steps: [
          { name: "Design Matrix", desc: "Each observation is expressed as a row of feature values, including a constant intercept column." },
          { name: "Normal Equations", desc: "Closed-form solutions compute weights by minimizing squared prediction errors." },
          { name: "Prediction", desc: "New inputs are multiplied by learned coefficients to predict the dependent variable." }
        ]
      },
      proscons: {
        advantages: [
          "Can model relationships using many predictors simultaneously.",
          "Maintains interpretability through coefficients assigned to each feature.",
          "Efficient to compute for moderate-sized datasets."
        ],
        disadvantages: [
          "Sensitive to multicollinearity among independent variables.",
          "Can be unstable when predictors are highly correlated.",
          "Still assumes a linear relationship; nonlinearity must be modeled separately."
        ]
      }
    }
  },
  {
    id: 'polynomial_regression',
    name: 'Polynomial Regression',
    category: 'Supervised Learning (Regression)',
    desc: 'Models non-linear relationships by adding higher-degree polynomial terms of features, allowing a curve to fit the data.',
    formula: 'y = w_0 + w_1 x + w_2 x^2 + ... + w_n x^n',
    sklearn: `from sklearn.preprocessing import PolynomialFeatures\nfrom sklearn.linear_model import LinearRegression\n\n# Transform features to degree 2\npoly = PolynomialFeatures(degree=2)\nX_poly = poly.fit_transform(X_train)\n\n# Fit linear regression\nmodel = LinearRegression()\nmodel.fit(X_poly, y_train)`,
    svgType: 'polynomial',
    extendedContent: {
      intro: {
        title: "What is Polynomial Regression?",
        desc: "Polynomial regression is a special case of multiple linear regression where we add polynomial terms (like X², X³) to model non-linear, curved relationships.",
        simpleFormula: "Y = β₀ + β₁X + β₂X² + ε",
        multipleFormula: "Y = β₀ + β₁X + β₂X² + β₃X³ + ε",
        simpleDesc: "By squaring the feature X, the model can learn quadratic (parabolic) curves.",
        multipleDesc: "Higher degrees (like power 3 or 4) allow the curve to bend more times to fit complex patterns."
      },
      howItWorks: {
        title: "How does it work?",
        steps: [
          { name: "Feature Transformation", desc: "Original features are transformed by adding polynomial terms (squaring, cubing, etc.)." },
          { name: "Linear Regression", desc: "A standard Linear Regression model is applied to these new polynomial features." },
          { name: "Curved Fit", desc: "Even though the model is linear in the parameters, it creates a non-linear curve with respect to the original input data." }
        ]
      },
      assumptions: [
        { name: "Linearity in Parameters", desc: "The relationship between the dependent variable and the parameters (weights) must still be linear." },
        { name: "Degree Selection", desc: "The degree of the polynomial must be carefully chosen to avoid severe overfitting." },
        { name: "Independence", desc: "Just like linear regression, observations must be independent." }
      ],
      proscons: {
        advantages: [
          "Can model non-linear relationships that simple linear regression cannot.",
          "Provides a better fit for curved data trends.",
          "Wide range of functions can be fit under it."
        ],
        disadvantages: [
          "Highly prone to overfitting if the degree is too high (creates highly oscillating curves).",
          "Extrapolates very poorly outside the bounds of the training data.",
          "Sensitive to outliers, which can dramatically change the shape of the curve."
        ]
      }
    }
  },
  {
    id: 'gradient_descent',
    name: 'Gradient Descent',
    category: 'Optimization Algorithm',
    desc: 'An iterative optimization algorithm used to minimize a cost function by updating model parameters in the direction of the steepest descent (negative gradient).',
    formula: 'θ = θ - α · ∇J(θ)',
    sklearn: `# Basic Gradient Descent Implementation in Python\nimport numpy as np\n\ndef gradient_descent(X, y, lr=0.01, epochs=1000):\n    m, n = X.shape\n    weights = np.zeros(n)\n    bias = 0.0\n\n    for epoch in range(epochs):\n        # Forward pass / prediction\n        y_pred = np.dot(X, weights) + bias\n\n        # Calculate gradients\n        dw = (1/m) * np.dot(X.T, (y_pred - y))\n        db = (1/m) * np.sum(y_pred - y)\n\n        # Update parameters\n        weights -= lr * dw\n        bias -= lr * db\n\n    return weights, bias`,
    svgType: 'gradient_descent',
    extendedContent: {
      intro: {
        title: "What is Gradient Descent?",
        desc: "Gradient Descent is the backbone optimization algorithm in modern Machine Learning and Deep Learning. Imagine you are standing on top of a mountain in thick fog — you cannot see the valley. You look around, feel the steepest downward slope under your feet, take a small step in that direction, and repeat until you reach the lowest point. That is exactly how Gradient Descent works: it minimizes a cost/loss function J(θ) by iteratively adjusting parameters (weights and biases) in the direction of the negative gradient (steepest downhill path).",
        simpleFormula: "θ_new = θ_old − α · ∇J(θ)",
        multipleFormula: "w_new = w_old − α · (∂J / ∂w)",
        simpleDesc: "θ represents all model parameters. The gradient ∇J(θ) tells us the direction of steepest ascent, so we subtract it to move downhill.",
        multipleDesc: "The learning rate α controls step size: too small ⇒ slow training; too large ⇒ overshoot/divergence. Typical values: 0.1, 0.01, 0.001."
      },
      howItWorks: {
        title: "How does Gradient Descent work?",
        steps: [
          { name: "Initialize Parameters", desc: "Start with random weights (w) and biases (b), or initialize them to zero. This is your random starting point on the mountain." },
          { name: "Calculate Cost J(θ)", desc: "Compute the prediction error using the loss function (e.g., MSE for regression: J = (1/n) Σ(y − ŷ)²) on the current inputs." },
          { name: "Compute Gradients (Differentiation)", desc: "Find the partial derivatives ∂J/∂w and ∂J/∂b — these gradients tell you the slope (direction and magnitude) of the cost surface at the current point." },
          { name: "Update Parameters", desc: "Apply the update rule: w = w − α·(∂J/∂w) and b = b − α·(∂J/∂b). We subtract because the gradient points uphill, and we want to go downhill." },
          { name: "Repeat Until Convergence", desc: "Iterate until the cost function stops decreasing significantly, the gradient approaches zero, or the maximum number of iterations is reached." }
        ]
      },
      assumptions: [
        { name: "What is a Gradient?", desc: "A gradient is simply the derivative (slope) of the cost function. It tells two things: Direction (which way to move) and Magnitude (how much to move). If dJ/dw > 0, the cost is increasing — move left (decrease w). If dJ/dw < 0, the cost is decreasing — move right (increase w)." },
        { name: "Why Subtraction in the Update Rule?", desc: "The derivative ∂J/∂θ points toward increasing error (uphill). Since we want to reduce error, we move in the opposite direction by subtracting: θ_new = θ_old − α·∂J/∂θ." },
        { name: "Step-by-Step Numerical Example", desc: "Let J(w) = w². Derivative: dJ/dw = 2w. Start: w=6, α=0.1. ▸ Iter 1: grad=2(6)=12, w=6−0.1(12)=4.8 ▸ Iter 2: grad=2(4.8)=9.6, w=4.8−0.1(9.6)=3.84 ▸ Iter 3: grad=2(3.84)=7.68, w=3.84−0.1(7.68)=3.072. The weight keeps approaching w=0 (the minimum)." },
        { name: "GD in Linear Regression", desc: "For ŷ = mx + b with cost J = (1/n)Σ(y−ŷ)², the gradients are: ∂J/∂m = −(2/n)Σ x(y−ŷ) and ∂J/∂b = −(2/n)Σ(y−ŷ). Update: m = m − α·∂J/∂m, b = b − α·∂J/∂b. Repeat until convergence." },
        { name: "Learning Rate: Small vs Large", desc: "Small α (e.g. 0.0001): Very stable but extremely slow convergence. Large α (e.g. 10): Fast but may overshoot the minimum, causing oscillation or divergence. Ideal α (e.g. 0.01): Fast and stable convergence. This is the most critical hyperparameter to tune." },
        { name: "Convergence Criteria", desc: "Gradient Descent stops when: (1) Gradient becomes near zero: ∇J ≈ 0, (2) Cost stops changing: J_new ≈ J_old, or (3) Maximum iterations reached." }
      ],
      metrics: [
        {
          name: "1. Batch Gradient Descent (BGD)",
          formula: "θ = θ − α · (1/m) · Σ_{i=1}^{m} ∇J(θ; x_i, y_i)",
          desc: "Computes the gradient using the ENTIRE training dataset at each step before making a single update. Like surveying the whole mountain before taking one step.",
          advantages: [
            "Smooth and stable convergence trajectory.",
            "Deterministic: will always follow the exact same path given the same initialization."
          ],
          disadvantages: [
            "Extremely slow for large datasets (needs to loop through all samples for every single weight update).",
            "High memory usage: requires the entire dataset to reside in RAM.",
            "Can get stuck easily in local minima or flat saddle points."
          ],
          whenToUse: "Appropriate for small-scale datasets where computational speed and memory limits are not bottlenecks."
        },
        {
          name: "2. Stochastic Gradient Descent (SGD)",
          formula: "θ = θ − α · ∇J(θ; x_i, y_i)",
          desc: "Updates parameters using only ONE randomly chosen training sample at each step. Like taking quick, somewhat random steps down the mountain.",
          advantages: [
            "Extremely fast and computationally cheap per update.",
            "Memory efficient: loads only one sample at a time.",
            "Stochastic noise helps escape local minima and saddle points.",
            "Supports online/streaming learning directly."
          ],
          disadvantages: [
            "Highly noisy/unstable convergence path: oscillates and zigzags.",
            "Never settles exactly at the global minimum (wanders around it)."
          ],
          whenToUse: "Excellent for extremely large datasets or real-time streaming data where learning must happen on the fly."
        },
        {
          name: "3. Mini-Batch Gradient Descent (MBGD)",
          formula: "θ = θ − α · (1/b) · Σ_{i=1}^{b} ∇J(θ; x_i, y_i)",
          desc: "The gold-standard compromise: updates parameters using a small batch (e.g., 32, 64, 128 samples) at a time. The most commonly used approach in practice.",
          advantages: [
            "Much more stable convergence than pure SGD (reduced oscillation).",
            "Leverages vectorized matrix operations on GPUs for massive speedups.",
            "Most commonly used optimizer setup in Deep Learning."
          ],
          disadvantages: [
            "Introduces batch size (b) as an additional hyperparameter to tune."
          ],
          whenToUse: "The default choice for modern Deep Learning models and large-scale algorithms. Used in Neural Networks, Transformers, etc."
        }
      ],
      proscons: {
        advantages: [
          "Universal optimizer — works for Linear Regression, Logistic Regression, Neural Networks, and all differentiable models.",
          "Scales to millions/billions of parameters where closed-form solutions are impossible.",
          "Variants (Adam, RMSProp, Adagrad) add adaptive learning rates for even better performance.",
          "Foundation of all modern Deep Learning training."
        ],
        disadvantages: [
          "Can get stuck in local minima or saddle points (especially in non-convex problems).",
          "Sensitive to learning rate choice — wrong α causes slow convergence or divergence.",
          "Vanishing gradients: in deep networks, gradients become tiny and training stalls.",
          "Exploding gradients: very large gradients cause unstable weight updates."
        ]
      },
      faq: [
        {
          q: "What is the difference between learning rate and gradient?",
          a: "The gradient is the vector pointing in the direction of steepest ascent (the slope). The learning rate (α) is a scalar multiplier that controls how large of a step we take in the opposite direction of that gradient."
        },
        {
          q: "What happens if the learning rate is too large or too small?",
          a: "If too small, training becomes extremely slow and might get stuck in local minima. If too large, the updates will overshoot the minimum, causing the loss to oscillate or completely diverge (explode)."
        },
        {
          q: "Why is Mini-batch preferred over Batch Gradient Descent in Deep Learning?",
          a: "Batch GD requires loading the entire dataset into memory for one step — impossible with millions of images. Mini-batch fits on GPU memory and leverages parallel computation."
        },
        {
          q: "What is the difference between Local Minima and Global Minima?",
          a: "A global minimum is the absolute lowest point of the cost function. A local minimum is a valley that is lower than its immediate neighbors but not the lowest point overall. Gradient descent can get trapped in local minima in non-convex problems."
        },
        {
          q: "What is a Saddle Point and why is it a problem?",
          a: "A saddle point is where the gradient becomes zero but the point is neither a minimum nor a maximum — it is a minimum along one axis and a maximum along another. The gradient is zero so GD stops, even though it hasn't found a minimum. Very common in high-dimensional deep learning."
        },
        {
          q: "How does Gradient Descent work in Neural Networks?",
          a: "In neural networks: (1) Forward Propagation computes predictions, (2) Loss is calculated, (3) Backpropagation computes gradients for every weight using the chain rule, (4) Gradient Descent updates all weights. This cycle repeats for many epochs until convergence."
        },
        {
          q: "Give a one-line interview answer for Gradient Descent.",
          a: "Gradient Descent is an iterative optimization algorithm that minimizes a loss function by computing the gradient (slope) with respect to model parameters and updating them in the opposite direction, controlled by a learning rate, and is the foundation of training in Linear Regression, Neural Networks, and all Deep Learning models."
        }
      ]
    }
  },
  {
    id: 'model_fitting',
    name: 'Model Fitting (Underfitting vs Overfitting)',
    category: 'Model Evaluation',
    desc: 'Analyzes how well a model generalizes to unseen data, balancing the trade-off between high bias (underfitting) and high variance (overfitting).',
    formula: 'Error = Bias² + Variance + Irreducible Noise',
    sklearn: `# Preventing Overfitting using Regularization (Ridge / Lasso) in Scikit-Learn
from sklearn.linear_model import Ridge, Lasso
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures

# Overfitting model (high variance)
overfit_model = make_pipeline(PolynomialFeatures(degree=15), LinearRegression())

# Regularized model to prevent overfitting (Ridge L2)
regularized_model = make_pipeline(
    PolynomialFeatures(degree=15), 
    Ridge(alpha=1.0) # alpha controls penalty strength
)

# Regularized model using Feature Selection (Lasso L1)
sparse_model = make_pipeline(
    PolynomialFeatures(degree=15), 
    Lasso(alpha=0.1)
)`,
    svgType: 'fitting',
    extendedContent: {
      metrics: [
        {
          name: "1. Underfitting (High Bias)",
          formula: "High Training Error & High Testing Error",
          desc: "Underfitting occurs when a machine learning model is too simple to capture the underlying structure of the data. It fails to learn the relationship between features and target, leading to poor performance on both training and test datasets.",
          advantages: [
            "Extremely fast to train and run.",
            "Requires minimal computational resources.",
            "No risk of overfitting to noise."
          ],
          disadvantages: [
            "Very low predictive power.",
            "Ignores critical feature interactions.",
            "High systematic error (Bias)."
          ],
          whenToUse: "Causes: Using a linear model for non-linear data, insufficient training epochs, or having too few features.\nRemedies: Add more features, use a more complex model (e.g., polynomial, trees), or decrease regularization strength."
        },
        {
          name: "2. Overfitting (High Variance)",
          formula: "Low Training Error & High Testing Error",
          desc: "Overfitting occurs when a model learns the training data, including its noise and random fluctuations, too well. While it performs exceptionally on the training set, it fails to generalize to new, unseen testing data.",
          advantages: [
            "Near-perfect accuracy on the training data.",
            "Good at memorizing complex historical databases."
          ],
          disadvantages: [
            "Fails dramatically in production/unseen testing environments.",
            "Captures random noise instead of the true underlying signal.",
            "Extremely sensitive to minor variations in input data (High Variance)."
          ],
          whenToUse: "Causes: Model is too complex for the amount of training data, training for too long, or using noisy features.\nRemedies: Gather more training data, simplify model architecture, apply Regularization (L1/L2), use Ensemble methods, or use Early Stopping."
        },
        {
          name: "3. Good Fit (Optimal Balance)",
          formula: "Low Training Error & Low Testing Error (Generalization)",
          desc: "The gold standard in machine learning. The model captures the true underlying signal of the data while ignoring the noise, showing high accuracy and consistent generalization across both training and test datasets.",
          advantages: [
            "High prediction accuracy on unseen production data.",
            "Robust against minor noise and fluctuations in inputs.",
            "Excellent generalization capability."
          ],
          disadvantages: [
            "Requires careful hyperparameter tuning and model validation.",
            "Requires a balanced dataset with clean representative samples."
          ],
          whenToUse: "Achieved when: The training loss and testing loss both decrease and stabilize near a low value, representing the optimal spot on the Bias-Variance tradeoff curve."
        }
      ],
      comparison: {
        title: "Bias-Variance Tradeoff Comparison Matrix",
        details: [
          { error: "Underfitting", mae: "High Bias", mse: "Low Variance", rmse: "High Train & Test Error" },
          { error: "Good Fit", mae: "Low Bias", mse: "Low Variance", rmse: "Low Train & Test Error" },
          { error: "Overfitting", mae: "Low Bias", mse: "High Variance", rmse: "Low Train / High Test Error" }
        ],
        bullets: [
          "Bias: Inability of ML algo to truly capture the pattern in training data -> Unable to understand the pattern.",
          "Variance: Error difference between testing and training.",
          "Bias represents the simplified assumptions a model makes about target function (High Bias = Underfitting).",
          "Variance represents how much the model's predictions change with different training datasets (High Variance = Overfitting).",
          "The ultimate goal of Model Fitting is to find the sweet spot that minimizes the sum of Bias² and Variance."
        ]
      },
      faq: [
        {
          q: "What is the Bias-Variance Tradeoff?",
          a: "It is the conflict in trying to simultaneously minimize bias and variance. As model complexity increases, bias decreases but variance increases. The trade-off is finding the optimal complexity that minimizes the total generalization error."
        },
        {
          q: "How does regularization prevent overfitting?",
          a: "Regularization adds a penalty term to the loss function based on the size of the model coefficients (weights). This discourages the model from learning overly complex boundaries and forces it to keep weights small, which smooths out the predictions and prevents it from fitting random noise."
        },
        {
          q: "Can cross-validation help detect overfitting?",
          a: "Yes! By partitioning the data into multiple train-test folds, cross-validation ensures you evaluate performance on unseen validation subsets. If validation accuracy is consistently lower than training accuracy, the model is overfitting."
        }
      ]
    }
  },
  {
    id: 'regression_metrics',
    name: 'Regression Metrics',
    category: 'Model Evaluation',
    desc: 'Key metrics for evaluating regression models, measuring how well the predicted continuous values align with the true values.',
    formula: 'MSE = (1/n) * Σ(y - ŷ)²',
    sklearn: `from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Calculate metrics
mse = mean_squared_error(y_true, y_pred)
rmse = mean_squared_error(y_true, y_pred, squared=False)
mae = mean_absolute_error(y_true, y_pred)
r2 = r2_score(y_true, y_pred)

# Adjusted R-squared
n = len(y_true)
p = X.shape[1]
adj_r2 = 1 - (1 - r2) * (n - 1) / (n - p - 1)`,
    svgType: 'metrics',
    extendedContent: {
      metrics: [
        {
          name: "1. Mean Absolute Error (MAE)",
          formula: "MAE = (1/n) * Σ |y - ŷ|",
          desc: "MAE measures the average vertical distance between actual points and the regression line. It treats all errors proportionally and represents the average magnitude of absolute residuals.",
          advantages: [
            "Extremely easy to understand intuitively.",
            "Expressed in the exact same unit as the target variable.",
            "Robust to outliers: Since errors aren't squared, large outlier errors don't dominate the metric."
          ],
          disadvantages: [
            "Mathematical drawback: The absolute value function creates a non-differentiable sharp turn at 0, making gradient calculations more difficult in optimization algorithms.",
            "Does not heavily penalize or flag very large single errors, which might be critical in high-cost scenarios."
          ],
          whenToUse: "Ideal for business scenarios where large errors are not disproportionately costly (e.g., general demand forecasting or house price prediction when off-by-a-little errors are linear)."
        },
        {
          name: "2. Mean Squared Error (MSE)",
          formula: "MSE = (1/n) * Σ (y - ŷ)²",
          desc: "Instead of measuring absolute distance, MSE measures squared area. Since differences are squared, small errors (<1) become smaller, while large errors (>1) grow exponentially (e.g., error of 10 becomes 100 squared units).",
          advantages: [
            "Mathematical convenience: It is smooth and continuously differentiable, making it the perfect loss function for gradient descent in linear models.",
            "Heavily penalizes larger errors, serving as a safety trigger for large deviations."
          ],
          disadvantages: [
            "Highly sensitive to outliers: A single outlier with massive error can inflate the MSE and make a decent model look poor.",
            "Scale issue: Units are squared (e.g., dollars squared, square-meters squared), making it non-intuitive to report."
          ],
          whenToUse: "Used as the default loss function during model training when you want your optimization to aggressively minimize large errors."
        },
        {
          name: "3. Root Mean Squared Error (RMSE)",
          formula: "RMSE = √[ (1/n) * Σ (y - ŷ)² ]",
          desc: "RMSE is the square root of MSE. It preserves MSE's properties of penalizing large errors while converting the units back to the target variable's original scale.",
          advantages: [
            "Same units as the output target, making it directly interpretable by stakeholders.",
            "Retains high weight/penalty on larger errors like MSE."
          ],
          disadvantages: [
            "Still sensitive to outliers (though less visually jarring than MSE, it is still mathematically driven by the squared terms under the root)."
          ],
          whenToUse: "The standard gold-standard metric for reporting regression performance when you want to penalize outliers heavily but need output-unit readability."
        },
        {
          name: "4. R² Score (Coefficient of Determination)",
          formula: "R² = 1 - (RSS / TSS) = 1 - [ Σ(y - ŷ)² / Σ(y - ȳ)² ]",
          desc: "Measures the proportion of variance in the dependent variable that is predictable from the independent variable(s). It compares your model's performance against a baseline 'Mean Model' (which simply predicts the average target value for every input).",
          advantages: [
            "Scale-free comparison metric: Ranges generally from 0 (baseline) to 1 (perfect prediction). A negative value means the model is worse than the baseline average prediction.",
            "Gives a quick percentage explanation of variance (e.g., R² = 0.8 means 80% variance explained, 20% unexplained)."
          ],
          disadvantages: [
            "R² will NEVER decrease when you add new features, regardless of whether the features are useful or completely random noise. This can lead to overfitting or misleading confidence."
          ],
          whenToUse: "To evaluate overall model explanation capability when comparing completely different models or datasets."
        },
        {
          name: "5. Adjusted R² Score",
          formula: "Adjusted R² = 1 - [ ((1 - R²) * (n - 1)) / (n - p - 1) ]",
          desc: "Adjusted R² is a corrected version of R² that accounts for the number of features (p) relative to sample size (n). It penalizes the score if you add useless features.",
          advantages: [
            "Only increases if the new feature improves the model more than would be expected by random chance.",
            "Decreases if useless, redundant, or random features are added (e.g. adding 'Favorite Color' to predict salary)."
          ],
          disadvantages: [
            "Can sometimes be slightly lower than standard R² and is harder to explain intuitively to non-technical business stakeholders."
          ],
          whenToUse: "Essential in Multiple Linear Regression to prevent feature creep and overfitting."
        }
      ],
      comparison: {
        title: "Quick Summary & Comparison",
        details: [
          { error: "Error = 1", mae: "1", mse: "1", rmse: "1" },
          { error: "Error = 2", mae: "2", mse: "4", rmse: "2" },
          { error: "Error = 5", mae: "5", mse: "25", rmse: "5" },
          { error: "Error = 10", mae: "10", mse: "100", rmse: "10" }
        ],
        bullets: [
          "Notice how MSE explodes exponentially for larger errors, while MAE grows linearly.",
          "MAE is robust to outliers, while MSE and RMSE are outlier-sensitive.",
          "Adjusted R² is the superior evaluation metric for multiple regression models with many features."
        ]
      },
      faq: [
        {
          q: "Can R² be negative?",
          a: "Yes! If the model performs worse than a simple horizontal line predicting the average value of the dataset, R² becomes negative. This indicates a very poorly fitting model."
        },
        {
          q: "Why is MSE preferred over MAE for Gradient Descent?",
          a: "MSE is continuously differentiable everywhere. MAE has a absolute value curve |y - ŷ| which has a non-differentiable cusp/vertex at error = 0, causing mathematical instability during gradient descent updates."
        },
        {
          q: "When should I report RMSE instead of MAE?",
          a: "Report RMSE if large errors are unacceptable or extremely costly to your application. Report MAE if you want the actual average error magnitude without outlier bias."
        }
      ]
    }
  },
  {
    id: 'perceptron_trick',
    name: 'Perceptron Trick',
    category: 'Optimization Algorithm',
    desc: 'An iterative method for adjusting weights in a simple linear classifier to separate data points effectively.',
    formula: 'w_{new} = w_{old} + \\eta \\cdot y_i \\cdot X_i',
    sklearn: `# --- Perceptron Trick Algorithm ---
# epochs = 1000, η = 0.01
# 
# for i in range(epochs):
#     randomly select a student (Xi)
#     
#     if Xi ∈ N and sum(wi*xi) >= 0:
#         Wnew = Wold - η * Xi
#         
#     if Xi ∈ P and sum(wi*xi) < 0:
#         Wnew = Wold + η * Xi
# ----------------------------------

# The Perceptron trick is the foundation of the Perceptron model
from sklearn.linear_model import Perceptron

# Initialize and fit
model = Perceptron(max_iter=1000, eta0=0.01)
model.fit(X_train, y_train)

# Predict classes
classes = model.predict(X_test)`,
    svgType: 'perceptron_trick',
    extendedContent: {
      intro: {
        title: "What is the Perceptron Trick?",
        desc: "The Perceptron Trick is an iterative method for adjusting weights in a simple linear classifier (Perceptron). It ensures that a model learns to separate data points into different classes effectively.",
        simpleTitle: "Update for Positive Class",
        simpleDesc: "Start with random weights. Check if a misclassification occurs. If misclassified, update the weights using a rule to move towards the correct classification. Repeat until convergence.",
        simpleFormula: "w_new = w_old + η·X_i (if positive class is misclassified as negative)",
        multipleTitle: "Update for Negative Class",
        multipleDesc: "Over time, repeated updates push the decision boundary towards optimal separation.",
        multipleFormula: "w_new = w_old - η·X_i (if negative class is misclassified as positive)"
      },
      howItWorks: {
        title: "How does it work?",
        steps: [
          { name: "Initialize Weights", desc: "Start with random weights for the decision boundary line." },
          { name: "Check Classification", desc: "Select a random point. Check if the point is correctly classified by the current line." },
          { name: "Update Rule", desc: "If misclassified, update the line's weights by shifting them towards the correct classification side." },
          { name: "Repeat", desc: "Repeat this process for a given number of epochs until all points are correctly classified or the epochs run out." }
        ]
      },
      assumptions: [
        { name: "Linear Separability", desc: "The dataset must be linearly separable for the perceptron to converge perfectly. Otherwise, it will oscillate." },
        { name: "Learning Rate (η)", desc: "A small step size used during the update. Don't apply transformation directly—we use a parameter η as learning rate to make gradual changes." },
        { name: "Geometric Intuition", desc: "If a point is misclassified, the weight vector w is adjusted by shifting it towards the correct classification side. Over time, repeated updates push the decision boundary towards optimal separation." }
      ]
    }
  },
  {
    id: 'logistic_regression',
    name: 'Logistic Regression',
    category: 'Supervised Learning (Classification)',
    desc: 'Predicts the probability of a binary outcome (0 or 1) using a logistic sigmoid function.',
    formula: 'p = 1 / (1 + e^{-(wᵀx + b)})',
    formulaHTML: '<span style="display:inline-flex;align-items:center;gap:8px;font-size:1.15em"><span>p &nbsp;=</span><span style="display:inline-flex;flex-direction:column;align-items:center;line-height:1.3"><span style="padding:0 8px">1</span><span style="border-top:1.5px solid rgba(255,255,255,0.5);padding:2px 8px 0">1 + e<sup>&thinsp;&minus;(W<sup>T</sup>X + b)</sup></span></span></span>',
    sklearn: `from sklearn.linear_model import LogisticRegression\n\n# Initialize and fit\nmodel = LogisticRegression()\nmodel.fit(X_train, y_train)\n\n# Predict probabilities or classes\nprobs = model.predict_proba(X_test)\nclasses = model.predict(X_test)`,
    svgType: 'logistic',
    extendedContent: {
      intro: {
        title: "The Sigmoid Activation Function",
        desc: "In logistic regression, the sigmoid function acts as the activation function. It takes the linear combination of input features and their corresponding weights (plus a bias term) and transforms it into a probability value between 0 and 1. This probability represents the likelihood of the input belonging to the positive class.",
        simpleTitle: "Perceptron Trick (Step Function)",
        simpleDesc: "The output is mapped to a discrete class.",
        simpleFormula: "y ∈ {0, 1}",
        multipleTitle: "Logistic Regression (Sigmoid Function)",
        multipleDesc: "The output is mapped to a continuous probability.",
        multipleFormula: "y ∈ [0, 1]"
      },
      howItWorks: {
        title: "How Does the Sigmoid Trick Work?",
        steps: [
          { name: "Step Function Limitations", desc: "A Perceptron is a linear model that traditionally uses a step function, which outputs a hard 0 or 1. This means it can only classify data that is perfectly linearly separable." },
          { name: "Introducing Non-linearity", desc: "Many real-world problems require non-linearity. The trick is to replace the step function with the sigmoid activation function: σ(x) = 1 / (1 + e^-x)." },
          { name: "Continuous Probabilities", desc: "The output of the model becomes y = σ(W·X + b), which produces continuous values between 0 and 1, making it highly suitable for probabilistic classification." },
          { name: "Smoother Gradient Descent Updates", desc: "Just like the perceptron trick, weights are updated using W_new = W_old + η * (Y_i - Ŷ_i) * X_i. However, Ŷ_i is now a continuous probability (e.g., 0.8) instead of a hard 0 or 1. If Y_i = 1 and Ŷ_i = 0.8, the difference is 0.2, creating a precise, proportional gradient update rather than an abrupt shift." }
        ]
      }
    }
  },
  {
    id: 'softmax_regression',
    name: 'Softmax Regression',
    category: 'Supervised Learning (Classification)',
    desc: 'Generalizes logistic regression to multi-class classification. Computes a probability distribution over K classes using the softmax function.',
    formula: 'P(y=k) = e^{z_k} / Σ_j e^{z_j}',
    formulaHTML: '<span style="display:inline-flex;align-items:center;gap:8px;font-size:1.15em"><span>P(y=k) &nbsp;=</span><span style="display:inline-flex;flex-direction:column;align-items:center;line-height:1.3"><span style="padding:0 8px">e<sup>&thinsp;z<sub>k</sub></sup></span><span style="border-top:1.5px solid rgba(255,255,255,0.5);padding:2px 8px 0">&Sigma;<sub>j</sub> e<sup>&thinsp;z<sub>j</sub></sup></span></span></span>',
    sklearn: `from sklearn.linear_model import LogisticRegression\n\n# Softmax = multinomial logistic regression\nmodel = LogisticRegression(multi_class='multinomial', solver='lbfgs')\nmodel.fit(X_train, y_train)\n\n# Predict probabilities for all K classes\nprobs = model.predict_proba(X_test)\nclasses = model.predict(X_test)`,
    svgType: 'softmax',
    extendedContent: {
      intro: {
        title: "The Softmax Activation Function",
        desc: "Softmax regression (also called multinomial logistic regression) extends binary logistic regression to handle multiple classes. Instead of a single sigmoid output, it computes a probability distribution across all K classes using the softmax function. Each class gets its own weight vector.",
        simpleTitle: "Logistic Regression (Sigmoid)",
        simpleDesc: "Binary classification — one probability output.",
        simpleFormula: "σ(z) = 1/(1+e⁻ᶻ)",
        multipleTitle: "Softmax Regression",
        multipleDesc: "Multi-class classification — probability distribution.",
        multipleFormula: "P(yₖ) = eᶻᵏ / Σⱼ eᶻʲ"
      },
      howItWorks: {
        title: "How Does Softmax Work?",
        steps: [
          { name: "Compute Logits", desc: "For each class k, compute a score zₖ = Wₖ·X + bₖ. Each class has its own learned weight vector Wₖ and bias bₖ." },
          { name: "Apply Softmax", desc: "Convert raw scores to probabilities: P(y=k) = eᶻᵏ / Σⱼ eᶻʲ. This ensures all probabilities are positive and sum to exactly 1." },
          { name: "Classify", desc: "Predict the class with the highest probability: ŷ = argmax_k P(y=k)." },
          { name: "Cross-Entropy Loss", desc: "The loss function is categorical cross-entropy: L = −Σₖ yₖ log(P̂ₖ). It heavily penalizes confident wrong predictions." },
          { name: "Gradient Descent", desc: "Update all weight vectors simultaneously using gradients of the cross-entropy loss. When K=2, this reduces exactly to logistic regression." }
        ]
      }
    }
  },
  {
    id: 'confusion_matrix',
    name: 'Confusion Matrix',
    category: 'Model Evaluation',
    desc: 'A table used to evaluate classification models by comparing predicted vs actual labels, showing True Positives, True Negatives, False Positives, and False Negatives.',
    formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
    formulaHTML: '<span style="display:inline-flex;align-items:center;gap:8px;font-size:1.15em"><span>Accuracy &nbsp;=</span><span style="display:inline-flex;flex-direction:column;align-items:center;line-height:1.3"><span style="padding:0 8px">TP + TN</span><span style="border-top:1.5px solid rgba(255,255,255,0.5);padding:2px 8px 0">TP + TN + FP + FN</span></span></span>',
    sklearn: `from sklearn.metrics import confusion_matrix, classification_report\n\n# Generate confusion matrix\ncm = confusion_matrix(y_true, y_pred)\n\n# Get detailed classification report\nreport = classification_report(y_true, y_pred)`,
    svgType: 'confusion_matrix',
    extendedContent: {
      intro: {
        title: "What is a Confusion Matrix?",
        desc: "A confusion matrix is a table that visualizes the performance of a classification model. It compares the predicted labels against the actual labels, breaking results into True Positives (TP), True Negatives (TN), False Positives (FP), and False Negatives (FN). It works for both binary and multi-class classification.",
        simpleTitle: "Binary Classification",
        simpleDesc: "A 2×2 matrix with TP, TN, FP, FN.",
        simpleFormula: "Accuracy = (TP+TN) / Total",
        multipleTitle: "Multi-class Classification",
        multipleDesc: "An N×N matrix for N classes.",
        multipleFormula: "Per-class Precision, Recall, F1"
      },
      howItWorks: {
        title: "How to Read the Confusion Matrix?",
        steps: [
          { name: "Rows = Actual", desc: "Each row represents the actual (true) class label from the dataset." },
          { name: "Columns = Predicted", desc: "Each column represents the predicted class label from the model." },
          { name: "Diagonal = Correct", desc: "Values on the main diagonal (TP, TN) represent correct predictions." },
          { name: "Off-diagonal = Errors", desc: "Values off the diagonal (FP, FN) represent classification errors." },
          { name: "Derive Metrics", desc: "From these four values, compute Accuracy, Precision, Recall, F1-Score, and Specificity." }
        ]
      }
    }
  },
  {
    id: 'knn',
    name: 'K-Nearest Neighbors (KNN)',
    category: 'Supervised Learning (Class. / Reg.)',
    desc: 'Classifies data points based on the majority class of their K nearest neighbors in the feature space.',
    formula: 'd(p,q) = sqrt(Σ (p_i - q_i)^2)',
    formulaHTML: '<span style="display:inline-flex;align-items:center;gap:8px;font-size:1.15em"><span>d(p,q) &nbsp;=</span><span style="display:inline-flex;flex-direction:column;align-items:center;line-height:1.3"><span></span><span style="padding:2px 8px 0">&radic;&Sigma; (p<sub>i</sub> - q<sub>i</sub>)<sup>2</sup></span></span></span>',
    sklearn: `from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.preprocessing import StandardScaler\n\n# Scale data\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\n# Initialize and fit\nmodel = KNeighborsClassifier(n_neighbors=5, metric='minkowski', p=2)\nmodel.fit(X_scaled, y)\n\n# Predict\npredictions = model.predict(X_test_scaled)`,
    svgType: 'knn'
  },
  {
    id: 'svm',
    name: 'Support Vector Machine (SVM)',
    category: 'Supervised Learning (Class. / Reg.)',
    desc: 'Finds an optimal hyperplane that maximizes the margin (distance) between different classes of data points in high-dimensional space.',
    formula: 'w·x - b = 0',
    formulaHTML: '<span style="display:inline-flex;align-items:center;gap:8px;font-size:1.15em"><span>W<sup>T</sup>X &minus; b &nbsp;= 0</span></span>',
    sklearn: `from sklearn.svm import SVC\n\n# Initialize Support Vector Classifier\nmodel = SVC(kernel='rbf', C=1.0)\nmodel.fit(X_train, y_train)\n\n# Get support vectors\nsupport_vectors = model.support_vectors_`,
    svgType: 'svm'
  },
  {
    id: 'decision_trees',
    name: 'Decision Trees',
    category: 'Supervised Learning (Class. / Reg.)',
    desc: 'Splits data points sequentially based on feature thresholds that maximize information gain (minimizing entropy/gini impurity).',
    formula: 'Entropy = -\\sum p_i \\log_2(p_i)',
    sklearn: `from sklearn.tree import DecisionTreeClassifier\n\n# Initialize and fit tree\nmodel = DecisionTreeClassifier(max_depth=5)\nmodel.fit(X_train, y_train)\n\n# Get decision paths\npaths = model.decision_path(X_test)`,
    svgType: 'tree',
    extendedContent: {
      intro: {
        title: "CART (Classification and Regression Tree)",
        desc: "CART builds a decision tree that predicts outcomes for both classification and regression tasks. It works by splitting data based on rules that reduce error at each step.",
        simpleTitle: "Classification Trees",
        simpleDesc: "Predict categorical target variables. Uses Gini Impurity to split nodes.",
        simpleFormula: "Gini = 1 - Σ(p_i)^2",
        multipleTitle: "Regression Trees",
        multipleDesc: "Predict continuous target variables. Uses Mean Squared Error (MSE) to split nodes.",
        multipleFormula: "MSE = (1/n) * Σ(y - ŷ)^2"
      },
      howItWorks: {
        title: "How CART Works",
        steps: [
          { name: "Binary Splits", desc: "CART always uses binary splits at every node (each node splits into exactly two branches)." },
          { name: "Recursive Splitting", desc: "The dataset is repeatedly split into smaller sub-regions until a stopping criterion is met (e.g., maximum depth)." },
          { name: "Node Types", desc: "Root Nodes (start), Internal Nodes (decision rules), Leaf Nodes (final predictors)." }
        ]
      },
      assumptions: [
        { name: "Advantages", desc: "Simple to understand, robust to outliers, and can handle non-linear boundaries." },
        { name: "Disadvantages", desc: "Can easily overfit the training data and lead to unstable tree structures if not pruned." }
      ]
    }
  },
  {
    id: 'ensemble_learning',
    name: 'Ensemble Learning (In Depth)',
    category: 'Ensemble Learning',
    desc: 'Combines multiple machine learning models to solve the same problem, producing a more accurate and robust model.',
    formula: '\\hat{y} = \\frac{1}{M} \\sum_{m=1}^{M} f_m(x)',
    sklearn: `from sklearn.ensemble import VotingClassifier\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.linear_model import LogisticRegression\n\n# Initialize base models\nmodel1 = DecisionTreeClassifier()\nmodel2 = LogisticRegression()\n\n# Combine them\nensemble = VotingClassifier(estimators=[('dt', model1), ('lr', model2)], voting='hard')\nensemble.fit(X_train, y_train)\npreds = ensemble.predict(X_test)`,
    svgType: 'ensemble_learning',
    extendedContent: {
      intro: {
        title: "What is Ensemble Learning?",
        desc: "Ensemble Learning is a machine learning paradigm in which multiple machine learning models are combined to solve the same problem, with the goal of producing a model that is more accurate, more robust, and more reliable than any individual model. The word ensemble comes from music and theater, where multiple performers work together to create a better performance than any one performer could achieve alone.",
        simpleTitle: "Core Philosophy",
        simpleDesc: "Many imperfect models can collectively become a highly accurate model based on the Wisdom of Crowds.",
        simpleFormula: "Many Weak Models → Strong Model",
        multipleTitle: "Statistical Intuition",
        multipleDesc: "If errors are independent and centered around zero, averaging models causes positive and negative errors to offset each other, reducing variance.",
        multipleFormula: "ŷ = y + ε"
      },
      howItWorks: {
        title: "Why Does a Single Model Make Errors?",
        steps: [
          { name: "Limited Training Data", desc: "If a model sees limited examples, it might fail on unseen patterns during testing." },
          { name: "Noisy Data", desc: "Real-world datasets contain incorrect labels, missing values, and human mistakes." },
          { name: "High Variance", desc: "Some algorithms are very sensitive to the training data. Even slight changes can completely change the learned model." },
          { name: "High Bias", desc: "Sometimes a model is too simple and cannot capture the complexity of the data." }
        ]
      },
      assumptions: [
        { name: "Accurate Individuals", desc: "Each individual model performs reasonably well. Models that are worse than random guessing generally contribute little." },
        { name: "Diversity", desc: "The models are diverse. They should not all make the same errors on the same examples. Diversity is the heart of ensemble learning." }
      ],
      proscons: {
        advantages: [
          "Higher predictive accuracy than most individual models.",
          "Better generalization to unseen data.",
          "Reduced sensitivity to noise.",
          "Improved robustness against overfitting in many scenarios.",
          "More stable predictions across different datasets.",
          "Often achieves state-of-the-art performance in practical ML competitions."
        ],
        disadvantages: [
          "Increased computational cost during training and inference.",
          "Higher memory requirements because multiple models must be stored.",
          "Reduced interpretability compared with a single model.",
          "More complex hyperparameter tuning and deployment."
        ]
      },
      faq: [
        { q: "Why Does Combining Models Improve Accuracy?", a: "If each model is reasonably accurate and their errors are not perfectly correlated, random errors tend to cancel out, while consistent patterns are reinforced. The final prediction is more reliable." },
        { q: "How is error reduced through averaging?", a: "Averaging reduces the influence of unusually high or low predictions from individual models, leading to a more stable estimate and lower variance." }
      ]
    }
  },
  {
    id: 'voting_ensemble',
    name: 'Voting Ensemble',
    category: 'Ensemble Learning',
    desc: 'An ensemble technique that combines predictions from multiple independent models using majority voting (classification) or averaging (regression).',
    formula: '\\text{Hard: mode}(f_i(x)) \\quad \\text{Soft: argmax}\\sum P(f_i(x)) \\quad \\text{Reg: } \\frac{1}{N}\\sum f_i(x)',
    sklearn: `from sklearn.ensemble import VotingClassifier, VotingRegressor\n\n# Hard Voting (Classification)\nclf = VotingClassifier(estimators=[('lr', model1), ('rf', model2)], voting='hard')\nclf.fit(X, y)\n\n# Soft Voting (Classification)\nclf_soft = VotingClassifier(estimators=[('lr', model1), ('rf', model2)], voting='soft')\nclf_soft.fit(X, y)\n\n# Voting Regressor\nreg = VotingRegressor(estimators=[('lr', reg1), ('rf', reg2)])\nreg.fit(X, y)`,
    svgType: 'voting_ensemble',
    extendedContent: {
      intro: {
        title: "What is a Voting Ensemble?",
        desc: "A Voting Ensemble is an intuitive ensemble technique where multiple independent machine learning models are trained on the same dataset, and their predictions are combined. Unlike boosting, the models do not learn from each other; they act democratically.",
        simpleTitle: "Classification (Hard vs Soft)",
        simpleDesc: "Hard Voting: Counts class labels and picks the majority. Soft Voting: Averages predicted probabilities, which takes confidence into account.",
        simpleFormula: "Vote / Average Probs",
        multipleTitle: "Regression (Average)",
        multipleDesc: "Since models predict continuous values, we cannot take a majority vote. Instead, we average the predictions to reduce variance.",
        multipleFormula: "ŷ = (1/N) Σ ŷ_i"
      },
      howItWorks: {
        title: "Key Characteristics",
        steps: [
          { name: "Independent Training", desc: "Models are trained independently on the same dataset. They never communicate during training." },
          { name: "Independent Predictions", desc: "Each model makes its own prediction without knowing what the other models predicted." },
          { name: "Combine via Voting / Averaging", desc: "Predictions are combined using a voting strategy for classification or averaging for regression." },
          { name: "Weighted Voting", desc: "Not all models are equally good. We can assign higher weights to more accurate models so their votes count more." }
        ]
      },
      assumptions: [
        { name: "Diverse & Accurate Models", desc: "For voting to be effective, base models should be reasonably accurate and make different types of errors." },
        { name: "Calibrated Probabilities (Soft Voting)", desc: "Soft voting requires models that can output reliable class probabilities." }
      ],
      proscons: {
        advantages: [
          "Easy to implement and understand.",
          "Combines strengths of multiple heterogeneous algorithms.",
          "Improves prediction accuracy and stability.",
          "Reduces the impact of a poor prediction from any single model."
        ],
        disadvantages: [
          "Training multiple models increases computational cost and memory.",
          "Poor or highly correlated models add little benefit.",
          "Hard voting completely ignores prediction confidence."
        ]
      },
      faq: [
        { q: "Hard Voting vs Soft Voting vs Voting Regressor?", a: "Hard Voting is for classification using majority class labels (ignores confidence). Soft Voting is for classification using average probabilities (considers confidence). Voting Regressor is for regression tasks using average numeric values." },
        { q: "Why is Soft Voting generally better than Hard Voting?", a: "Soft voting considers the confidence of each model. If one model is 99% confident in Class A, and two models are 51% confident in Class B, Soft voting can still pick Class A, whereas Hard voting would blindly pick Class B." }
      ]
    }
  },
  {
    id: 'stacking_ensemble',
    name: 'Stacking Ensemble',
    category: 'Ensemble Learning',
    desc: 'An ensemble learning technique that uses a Meta Learner (Level-1 model) to optimally combine the predictions of multiple Base Models (Level-0 models).',
    formula: 'y_{meta} = f_{meta}(f_1(x), f_2(x), ..., f_n(x))',
    sklearn: `from sklearn.ensemble import StackingClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.svm import SVC\n\n# Level 0 (Base Models)\nbase_models = [\n    ('dt', DecisionTreeClassifier()),\n    ('svc', SVC(probability=True))\n]\n\n# Level 1 (Meta Learner)\nmeta_model = LogisticRegression()\n\n# Stacking Ensemble\nstacking = StackingClassifier(estimators=base_models, final_estimator=meta_model, cv=5)\nstacking.fit(X_train, y_train)\npreds = stacking.predict(X_test)`,
    svgType: 'stacking_ensemble',
    extendedContent: {
      intro: {
        title: "What is Stacking (Stacked Generalization)?",
        desc: "Stacking is an advanced ensemble technique where multiple base models (Level-0) are trained independently, and their predictions are used as inputs to a Meta Learner (Level-1). Unlike voting, which uses fixed rules, Stacking learns how to optimally combine base models—essentially asking 'Which model should I trust more for this particular input?'",
        simpleTitle: "Core Philosophy",
        simpleDesc: "Different models capture different patterns. Don't just average them; let another algorithm learn the best way to combine them.",
        simpleFormula: "Base Models + Meta Learner",
        multipleTitle: "Real-Life Analogy",
        multipleDesc: "Like a Chief Medical Officer (Meta Learner) reviewing the independent diagnoses of 5 different specialists (Base Models) to make the final call.",
        multipleFormula: "CMO(Docs)"
      },
      howItWorks: {
        title: "Step-by-Step Working",
        steps: [
          { name: "Step 1: Train Base Models", desc: "Train every Level-0 model (e.g., Random Forest, SVM, LR) independently on the training data." },
          { name: "Step 2: Generate Predictions", desc: "Each base model makes predictions. Instead of voting, these predictions are stored to form a new dataset." },
          { name: "Step 3: Create Meta-Dataset", desc: "The original features are replaced by the base models' predictions. The actual target labels remain the same." },
          { name: "Step 4: Train Meta Learner", desc: "The Meta Learner (Level-1 model) is trained on this new meta-dataset. It learns which base models to trust under different conditions." },
          { name: "Step 5: Final Prediction", desc: "For new data, base models generate predictions first, which are then passed to the Meta Learner for the final output." }
        ]
      },
      assumptions: [
        { name: "K-Fold Cross-Validation is Crucial", desc: "To prevent the Meta Learner from overfitting, out-of-fold predictions from K-Fold CV are used to train it, ensuring it learns from unseen data." },
        { name: "Diverse Base Models", desc: "Base models should capture different complementary patterns (e.g., mixing linear models with tree-based models)." }
      ],
      proscons: {
        advantages: [
          "Often achieves higher accuracy than individual models.",
          "Learns the optimal way to combine different algorithms.",
          "Can combine completely different model types (heterogeneous models).",
          "Captures complementary strengths of base learners."
        ],
        disadvantages: [
          "More complex to implement than voting or bagging.",
          "Computationally expensive because multiple models must be trained.",
          "Requires careful cross-validation to prevent data leakage.",
          "More difficult to interpret than a single model."
        ]
      },
      faq: [
        { q: "Why use Stacking over Majority Voting?", a: "Voting applies a fixed rule. If two weak models agree and one strong model disagrees, Voting might pick the wrong answer. Stacking can learn to trust the strong model in that specific scenario." },
        { q: "When Should You Use Stacking?", a: "When you have multiple strong but diverse models, maximizing performance is critical, and you have sufficient computational resources and data." },
        { q: "Voting vs Stacking", a: "Voting uses fixed combinations (vote/average) with one level of training. Stacking learns the combination using a Meta Learner and involves two levels of training." }
      ]
    }
  },
  {
    id: 'bagging',
    name: 'Bagging (Bootstrap Aggregating)',
    category: 'Ensemble Learning',
    desc: 'An ensemble learning technique that reduces variance by training multiple models independently on different bootstrap samples of the training dataset.',
    formula: '\\hat{y} = \\frac{1}{M} \\sum_{m=1}^{M} f_m(x)',
    sklearn: `from sklearn.ensemble import BaggingClassifier\nfrom sklearn.tree import DecisionTreeClassifier\n\n# Initialize base model\nbase_model = DecisionTreeClassifier()\n\n# Initialize Bagging Ensemble\nbagging = BaggingClassifier(estimator=base_model, n_estimators=100, random_state=42, oob_score=True)\nbagging.fit(X_train, y_train)\n\n# Get Out-of-Bag Score\nprint("OOB Score:", bagging.oob_score_)`,
    svgType: 'bagging',
    extendedContent: {
      intro: {
        title: "What is Bagging?",
        desc: "Bagging (Bootstrap Aggregating) is a fundamental ensemble technique designed to reduce variance and prevent overfitting. It trains multiple versions of the same algorithm (usually high-variance models like Decision Trees) on different random subsets of the training data, then aggregates their predictions.",
        simpleTitle: "Core Philosophy",
        simpleDesc: "Instead of trusting one unstable model, train many slightly different versions of the same model and combine their predictions so random errors cancel out.",
        simpleFormula: "Bootstrap + Aggregating",
        multipleTitle: "Bootstrap Sampling",
        multipleDesc: "Random sampling with replacement. Each model sees a slightly different version of the dataset, leading to diverse models.",
        multipleFormula: "With Replacement"
      },
      howItWorks: {
        title: "Step-by-Step Working",
        steps: [
          { name: "Step 1: Bootstrap Sampling", desc: "Create multiple datasets by randomly sampling from the original dataset with replacement. About 63.2% of original samples appear in each bootstrap sample." },
          { name: "Step 2: Train Independent Models", desc: "Train a separate model (e.g., Decision Tree) on each bootstrap dataset. There is no communication between models." },
          { name: "Step 3: Generate Predictions", desc: "Each model makes a prediction independently on the test data." },
          { name: "Step 4: Aggregate", desc: "Combine the predictions using Majority Voting (for classification) or Averaging (for regression)." }
        ]
      },
      assumptions: [
        { name: "High Variance Models", desc: "Bagging works best with unstable, high-variance models (like unpruned Decision Trees) where small changes in data lead to large changes in the model." },
        { name: "Out-of-Bag (OOB) Samples", desc: "Since sampling is with replacement, about 36.8% of samples are left out per model. These 'OOB' samples can be used to validate the model without needing a separate validation set." }
      ],
      proscons: {
        advantages: [
          "Reduces variance and overfitting.",
          "Produces more stable and robust predictions.",
          "Handles noisy datasets better than single models.",
          "Training can be parallelized because models are independent.",
          "OOB samples provide a built-in validation mechanism."
        ],
        disadvantages: [
          "Increases computational cost and memory usage.",
          "Provides little benefit for already stable, low-variance algorithms (like Linear Regression).",
          "Loss of interpretability compared to a single model."
        ]
      },
      faq: [
        { q: "Bagging vs Voting?", a: "Voting trains different algorithms on the same dataset. Bagging trains the same algorithm on different bootstrap samples of the dataset." },
        { q: "What is the relationship between Bagging and Random Forest?", a: "Random Forest is the most famous bagging algorithm. It applies bagging to Decision Trees and adds random feature selection at each split to increase diversity." }
      ]
    }
  },
  {
    id: 'random_forests',
    name: 'Random Forests',
    category: 'Ensemble Learning',
    desc: 'Combines predictions from multiple decision trees trained on bootstrap samples to reduce variance and combat overfitting.',
    formula: 'Forest(x) = \\frac{1}{N} \\sum Tree_i(x)',
    sklearn: `from sklearn.ensemble import RandomForestClassifier\n\n# Initialize ensemble forest\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\n\n# Feature importances\nimportances = model.feature_importances_`,
    svgType: 'forest',
    extendedContent: {
      intro: {
        title: "Introduction to Random Forest | Intuition Behind the Algorithm",
        desc: "A Random Forest is a supervised ensemble machine learning algorithm that combines multiple Decision Trees to make a more accurate and robust prediction. Instead of relying on a single decision tree, Random Forest builds many decision trees and combines their predictions.",
        simpleTitle: "Why Do We Need Random Forest?",
        simpleDesc: "Imagine you ask only one friend whether it will rain tomorrow. If that friend is wrong, your decision is wrong. Now imagine asking 100 people and taking the majority opinion. The final answer is much more reliable. Random Forest works exactly like this. Instead of one decision tree, it asks hundreds of decision trees.",
        simpleFormula: "Classification: Uses Majority Voting",
        multipleTitle: "Basic Idea & Intuition",
        multipleDesc: "Instead of building 1 Decision Tree, we build Decision Tree 1 to 100. Every tree is slightly different. Finally: All Trees → Majority Vote → Final Prediction. Imagine a cricket selection committee. Instead of one selector, we have 5 selectors observing different aspects (Batting, Bowling, Fitness, Experience, Fielding). Finally, they vote. The majority decision is more reliable.",
        multipleFormula: "Regression: Uses Average Prediction"
      },
      howItWorks: {
        title: "Training Process & How It Solves Overfitting",
        steps: [
          { name: "Problem with Decision Trees: Overfitting", desc: "Decision Trees are easy to understand but have one major problem: Overfitting. A decision tree may memorize the training data. Example Model: Decision Tree, Training Accuracy: 100%, Testing Accuracy: 78%. The model performs perfectly on training data but poorly on unseen data. This happens because the tree learns noise. Random Forest reduces Overfitting, Variance, Noise sensitivity while improving Accuracy, Stability, Generalization." },
          { name: "1. Random Sampling of Data (Bootstrap Sampling)", desc: "Suppose we have 1000 training samples. Instead of giving all 1000 samples to every tree, Tree 1 receives Random 1000 samples (with replacement). Tree 2 receives another random sample. Some records repeat. Some records never appear. Example Original Data: [1, 2, 3, 4, 5]. Bootstrap Sample: [2, 2, 5, 1, 4]. Notice 3 is missing, 2 appears twice. This creates diversity among trees." },
          { name: "2. Random Feature Selection", desc: "Suppose we have 10 Features (Age, Salary, Height, Weight, City, Gender, Education, Experience, Income, Occupation). Decision Tree checks all features. Random Forest allows a tree to check only a random subset. Tree 1 may use: Age, Salary, Income. Tree 2 may use: Height, Weight, Gender. Since every tree sees different features, they make different mistakes. Combining different mistakes improves performance." },
          { name: "Training & Prediction Process", desc: "Training Process: Training Dataset → Bootstrap Sampling → Decision Tree 1 to N → Store All Trees (No pruning is typically performed; each tree is grown deeply). Prediction Process Example: Suppose a new customer arrives. Every tree predicts independently. Tree 1→Yes, Tree 2→Yes, Tree 3→No, Tree 4→Yes, Tree 5→Yes. Majority=Yes. Final Prediction=Yes." },
          { name: "Regression Example & Why Does It Work So Well?", desc: "Regression Example: Suppose five trees predict house prices: ₹20 Lakh, ₹22 Lakh, ₹21 Lakh, ₹24 Lakh, ₹23 Lakh. Average (20+22+21+24+23)/5 = ₹22 Lakh. Why Does It Work? Each tree makes different errors. When many trees are combined, Random Forest cancels out individual mistakes. Mathematically: Many Weak Models → Average / Voting → Strong Model. This is the power of ensemble learning." }
        ]
      },
      proscons: {
        advantages: [
          "High accuracy",
          "Reduces overfitting",
          "Handles large datasets well",
          "Works with numerical and categorical features",
          "Robust to noisy data",
          "Handles missing values reasonably well",
          "Provides feature importance",
          "Parallelizable because trees are independent"
        ],
        disadvantages: [
          "Slower than a single Decision Tree",
          "Requires more memory",
          "Less interpretable (\"black-box\" compared to one tree)",
          "Large forests can increase prediction time"
        ]
      },
      assumptions: [
        { name: "Important Hyperparameters: Trees & Depth", desc: "1. n_estimators: Number of trees (e.g., n_estimators=100). More trees usually improve performance but increase computation. 2. max_depth: Maximum depth of each tree (e.g., max_depth=10). Controls model complexity." },
        { name: "Important Hyperparameters: Features & Splits", desc: "3. max_features: Number of random features considered at each split (e.g., max_features='sqrt'). Common options: 'sqrt' (default for classification), 'log2', Integer value, Float (fraction of features). 4. min_samples_split: Minimum samples required to split a node (e.g., 5). 5. min_samples_leaf: Minimum samples required at a leaf node (e.g., 2)." },
        { name: "Important Hyperparameters: Bootstrap & Random State", desc: "6. bootstrap: Whether to use bootstrap sampling (e.g., True). 7. random_state: Ensures reproducible results (e.g., 42)." },
        { name: "Time Complexity", desc: "Let: n = number of samples, m = number of features, T = number of trees. Approximate training complexity: O(T × n × m × log n). Prediction complexity grows linearly with the number of trees because each tree makes a prediction independently." },
        { name: "Real-World Applications", desc: "Fraud Detection, Credit Risk Analysis, Disease Prediction, Customer Churn Prediction, Stock Market Trend Prediction, Loan Approval, Email Spam Detection, Recommendation Systems, Image Classification, Remote Sensing and Land Cover Classification." },
        { name: "Summary", desc: "Training Data → Bootstrap Sampling → Random Feature Selection → Many Decision Trees → Classification (Majority Voting) / Regression (Average Prediction) → Accurate, Stable, Generalized Model. Key takeaway: Random Forest is an ensemble of many diverse decision trees. By introducing randomness through bootstrap sampling and random feature selection, it reduces overfitting and variance while producing predictions that are generally more accurate and robust than those of a single decision tree." }
      ],
      faq: [
        { q: "1. Why does Random Forest perform better than a single Decision Tree?", a: "Because it combines many decision trees, reducing overfitting and variance, making it much more robust than a single tree." },
        { q: "2. What is bootstrap sampling?", a: "Random sampling of the dataset with replacement, allowing some records to repeat and some to be left out, creating diversity." },
        { q: "3. What is feature bagging?", a: "Randomly selecting a subset of features for each tree to consider at each split, rather than using all features." },
        { q: "4. Why does Random Forest reduce overfitting?", a: "By combining the results of many different trees, the noise and memorization from individual trees are averaged out." },
        { q: "5. What is Out-of-Bag (OOB) error?", a: "The error calculated using the samples that were not selected (left out) in the bootstrap sample during training." },
        { q: "6. How is prediction performed for classification and regression?", a: "Classification uses Majority Voting. Regression uses Average Prediction." },
        { q: "7. What is the role of max_features?", a: "It determines the maximum number of random features considered for splitting a node, ensuring trees remain different from each other." },
        { q: "8. Why are the trees in a Random Forest intentionally made different?", a: "So they make different, independent mistakes. Averaging these mistakes improves the overall performance of the ensemble." },
        { q: "9. Can Random Forest handle missing values and outliers?", a: "Yes, it handles missing values reasonably well and is robust to noisy data and outliers." },
        { q: "10. When might a single Decision Tree be preferred over a Random Forest?", a: "When interpretability and faster execution speed are required over the maximum possible accuracy." }
      ]
    }
  },
  {
    id: 'kmeans',
    name: 'K-Means Clustering',
    category: 'Unsupervised Learning',
    desc: 'Partitions data points into K clusters by iteratively assigning points to the nearest centroid and updating centroids.',
    formula: 'J = Σ (i=1 to K) Σ (x ∈ Sᵢ) ||x - μᵢ||²',
    sklearn: `from sklearn.cluster import KMeans\n\n# Initialize cluster model\nkmeans = KMeans(n_clusters=3, random_state=42)\nkmeans.fit(X)\n\n# Cluster centroids & labels\ncentroids = kmeans.cluster_centers_\nlabels = kmeans.labels_`,
    svgType: 'kmeans',
    extendedContent: {
      intro: {
        title: "What is K-Means Clustering?",
        desc: "K-Means is an unsupervised machine learning algorithm used to group an unlabeled dataset into different clusters. 'K' represents the number of pre-defined clusters.",
        simpleTitle: "The Objective",
        simpleDesc: "To minimize the Sum of Squared Errors (SSE) within each cluster. In simpler terms, it tries to make the data points in a cluster as similar as possible while keeping different clusters as far apart as possible.",
        simpleFormula: "Minimize: Σ (Distance from Point to its Centroid)²"
      },
      howItWorks: {
        title: "The Step-by-Step Process",
        steps: [
          { name: "Step 1: Initialization", desc: "Randomly select K points from the dataset to act as the initial cluster centers (centroids)." },
          { name: "Step 2: Assignment", desc: "Calculate the distance between each data point and the K centroids. Assign each data point to the cluster of its nearest centroid." },
          { name: "Step 3: Update", desc: "Recalculate the centroids by taking the mean (average) of all data points assigned to that cluster's centroid." },
          { name: "Step 4: Repeat", desc: "Repeat Steps 2 and 3 until the centroids no longer move (convergence) or a maximum number of iterations is reached." }
        ]
      },
      proscons: {
        advantages: [
          "Simple to implement and intuitively easy to understand.",
          "Scales well to large datasets and is computationally efficient (O(K×N×I)).",
          "Guaranteed to converge (though it may find a local minimum)."
        ],
        disadvantages: [
          "You must manually specify K (the number of clusters) in advance.",
          "Highly sensitive to outliers, which can drag centroids completely off-center.",
          "Assumes clusters are spherical and evenly sized; struggles with complex geometric shapes (like moons or concentric circles)."
        ]
      }
    }
  },
  {
    id: 'regularization',
    name: 'Regularization (L1/L2)',
    category: 'Model Tuning & Optimization',
    desc: 'Prevents overfitting by adding a penalty term to the loss function based on the size of the model weights (Lasso and Ridge).',
    formula: 'Loss = MSE + λ × Penalty',
    sklearn: `from sklearn.linear_model import Ridge, Lasso\nfrom sklearn.preprocessing import StandardScaler\n\n# Scale data\nscaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)\n\n# L2 Regularization (Ridge)\nridge = Ridge(alpha=1.0)\nridge.fit(X_scaled, y)\n\n# L1 Regularization (Lasso)\nlasso = Lasso(alpha=0.1)\nlasso.fit(X_scaled, y)`,
    svgType: 'regularization',
    extendedContent: {
      intro: {
        title: "Mathematical Formulas",
        desc: "Regularization adds a penalty term to the loss function to constrain model weights.",
        simpleTitle: "🎯 L1 Regularization (Lasso)",
        simpleDesc: "Sum of absolute values of weights. Promotes sparsity by driving some weights to exactly zero, performing automatic feature selection.",
        simpleFormula: "Loss = MSE + λ × Σ|wᵢ|",
        multipleTitle: "🌊 L2 Regularization (Ridge)",
        multipleDesc: "Sum of squared weights. Shrinks weights towards zero but doesn't eliminate them completely, reducing model complexity.",
        multipleFormula: "Loss = MSE + λ × Σwᵢ²"
      },
      howItWorks: {
        title: "Understanding Weight Behavior",
        steps: [
          { name: "At λ = 0 (No Regularization)", desc: "The model has no penalty for large weights, so it can freely adjust to minimize training error. With enough iterations, it gets very close to the true weights." },
          { name: "As λ Increases", desc: "Now the model has two competing goals: fit the data well AND keep weights small. Higher λ means more emphasis on keeping weights small." },
          { name: "L1 Behavior (Lasso)", desc: "Drives some weights to exactly zero. Result: Automatic feature selection." },
          { name: "L2 Behavior (Ridge)", desc: "Shrinks all weights toward zero proportionally. Result: Smooth weight shrinkage." }
        ]
      },
      metrics: [
        {
          name: "Bias-Variance Tradeoff",
          desc: "Regularization adds bias (pulls weights away from true values) but reduces variance (makes the model more stable and generalizable).",
          advantages: ["Prevents overfitting", "Lasso performs feature selection", "Improves generalization"],
          disadvantages: ["Introduces hyperparameter λ (alpha) to tune", "Adds bias to the model predictions"]
        }
      ]
    }
  }
];

export const ML_ALGORITHM_IDS = ML_ALGORITHMS.map((a) => a.id);
