import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import load_wine
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis as LDA
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

def run_demo():
    print("=" * 60)
    print(" PCA & LDA Dimensionality Reduction Demo ")
    print("=" * 60)

    # 1. Load the Wine Dataset (13 dimensions/features, 3 classes)
    wine = load_wine()
    X = wine.data
    y = wine.target
    feature_names = wine.feature_names
    target_names = wine.target_names

    print(f"[*] Loaded Wine Dataset:")
    print(f"    - Number of samples: {X.shape[0]}")
    print(f"    - Number of features (dimensions): {X.shape[1]}")
    print(f"    - Classes: {target_names} (Labels: {np.unique(y)})\n")

    # 2. Standardize the features
    # (Crucial for PCA because it is sensitive to the scale of variables)
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # 3. Split into Train & Test sets (for classification evaluation)
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.3, random_state=42, stratify=y
    )

    # 4. Apply Unsupervised PCA (Reduce to 2D)
    pca = PCA(n_components=2)
    X_train_pca = pca.fit_transform(X_train)
    X_test_pca = pca.transform(X_test)
    explained_var = pca.explained_variance_ratio_

    print("[*] PCA Transformation:")
    print(f"    - Explained Variance Ratio: PC1={explained_var[0]:.2%}, PC2={explained_var[1]:.2%}")
    print(f"    - Total variance captured in 2D: {sum(explained_var):.2%}\n")

    # 5. Apply Supervised LDA (Reduce to 2D)
    # LDA is supervised, so we pass y_train to fit()
    lda = LDA(n_components=2)
    X_train_lda = lda.fit_transform(X_train, y_train)
    X_test_lda = lda.transform(X_test)
    explained_var_lda = lda.explained_variance_ratio_

    print("[*] LDA Transformation:")
    print(f"    - Explained Variance Ratio: LD1={explained_var_lda[0]:.2%}, LD2={explained_var_lda[1]:.2%}")
    print(f"    - Total class separability captured in 2D: {sum(explained_var_lda):.2%}\n")

    # 6. Evaluate Logistic Regression Classifier
    # original vs PCA vs LDA
    models = {
        "Original (13 features)": (X_train, X_test),
        "PCA-Reduced (2 features)": (X_train_pca, X_test_pca),
        "LDA-Reduced (2 features)": (X_train_lda, X_test_lda)
    }

    print("[*] Evaluating Classifier Performance (Logistic Regression):")
    for name, (tr, te) in models.items():
        clf = LogisticRegression(random_state=42)
        clf.fit(tr, y_train)
        preds = clf.predict(te)
        acc = accuracy_score(y_test, preds)
        print(f"    - {name:25} Accuracy: {acc:.2%}")
    print()

    # 7. Plotting the results side-by-side
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    colors = ['#ff7f0e', '#1f77b4', '#2ca02c']
    markers = ['s', 'x', 'o']

    # Plot PCA Projections
    for l, c, m in zip(np.unique(y_train), colors, markers):
        ax1.scatter(
            X_train_pca[y_train == l, 0], 
            X_train_pca[y_train == l, 1], 
            c=c, label=f'Class {target_names[l]}', marker=m, alpha=0.8, edgecolors='black' if m!='x' else None
        )
    ax1.set_title(f'PCA: Unsupervised Projection (2D)\nVariance Captured: {sum(explained_var):.1%}', fontsize=12, fontweight='bold')
    ax1.set_xlabel(f'Principal Component 1 ({explained_var[0]:.1%})')
    ax1.set_ylabel(f'Principal Component 2 ({explained_var[1]:.1%})')
    ax1.legend()
    ax1.grid(True, linestyle='--', alpha=0.5)

    # Plot LDA Projections
    for l, c, m in zip(np.unique(y_train), colors, markers):
        ax2.scatter(
            X_train_lda[y_train == l, 0], 
            X_train_lda[y_train == l, 1], 
            c=c, label=f'Class {target_names[l]}', marker=m, alpha=0.8, edgecolors='black' if m!='x' else None
        )
    ax2.set_title(f'LDA: Supervised Projection (2D)\nClass Separability Captured: {sum(explained_var_lda):.1%}', fontsize=12, fontweight='bold')
    ax2.set_xlabel(f'Linear Discriminant 1 ({explained_var_lda[0]:.1%})')
    ax2.set_ylabel(f'Linear Discriminant 2 ({explained_var_lda[1]:.1%})')
    ax2.legend()
    ax2.grid(True, linestyle='--', alpha=0.5)

    plt.tight_layout()
    plot_filename = "pca_lda_comparison.png"
    plt.savefig(plot_filename, dpi=300)
    print(f"[*] Visualizations saved as '{plot_filename}' in your directory.\n")
    print("=" * 60)

if __name__ == "__main__":
    run_demo()
