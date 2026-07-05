import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# 1. Generate some dataset (Just like typical Machine Learning)
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Preprocess the data (Standardization is crucial for Deep Learning)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# 3. Build a Deep Learning Model (A simple Feed-Forward Neural Network)
# This is analogous to instantiating an ML model, but you define the architecture layer by layer.
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)), # Hidden Layer 1
    Dense(32, activation='relu'),                                  # Hidden Layer 2
    Dense(1, activation='sigmoid')                                 # Output Layer (for binary classification)
])

# 4. Compile the model
# We define how the model will learn (optimizer) and how we measure error (loss).
model.compile(optimizer='adam', 
              loss='binary_crossentropy', 
              metrics=['accuracy'])

# 5. Train the model (Similar to model.fit() in scikit-learn)
print("Training the deep learning model...")
history = model.fit(X_train, y_train, 
                    epochs=20,          # How many times to go through the dataset
                    batch_size=32,      # Number of samples per gradient update
                    validation_split=0.2, # Use 20% of training data to monitor overfitting
                    verbose=1)

# 6. Evaluate the model on unseen test data
loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"\nTest Accuracy: {accuracy:.4f}")

# 7. Make predictions (Similar to model.predict() in scikit-learn)
predictions = model.predict(X_test[:5])
# Since it outputs probabilities for binary classification, we convert them to 0 or 1
predicted_classes = (predictions > 0.5).astype(int).flatten()

print("\nPredictions for first 5 test samples:")
print(predicted_classes)
print("Actual labels:")
print(y_test[:5])
