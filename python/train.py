import argparse
import json
import os
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, accuracy_score
from sklearn.ensemble import RandomForestClassifier
import pickle


def preprocess_row(row: pd.Series) -> list:
    """Match the exact preprocessing used in services/mlService.js

    Inputs (expected columns):
      fundingAmount, teamSize, yearsInBusiness, revenue,
      marketSize in {Small, Medium, Large},
      competitionLevel in {Low, Medium, High},
      businessModel in {B2B, B2C, B2B2C, Marketplace, SaaS, Other}
    """
    # Map columns from records.xls
    # funding_total_usd -> funding
    # funding_rounds -> team size
    # founded_at -> years in business (approx)
    # status -> label
    # For demonstration, use funding_total_usd, funding_rounds, and founded_at year
    try:
        funding = float(row["funding_total_usd"]) if row["funding_total_usd"] != '-' and not pd.isna(row["funding_total_usd"]) else 0.0
    except:
        funding = 0.0
    try:
        team_size = float(row["funding_rounds"]) if not pd.isna(row["funding_rounds"]) else 0.0
    except:
        team_size = 0.0
    try:
        if pd.isna(row["founded_at"]) or row["founded_at"] == '':
            years_in_business = 0.0
        else:
            years_in_business = 2025 - int(str(row["founded_at"]).split("-")[0])
    except:
        years_in_business = 0.0
    # You can add more features as needed
    normalized_funding = np.log(funding + 1.0) / 15.0
    normalized_team_size = team_size / 10.0
    normalized_years = years_in_business / 50.0
    return [
        normalized_funding,
        normalized_team_size,
        normalized_years,
    ]


def load_data(data_path: Path, label_column=None) -> tuple:
    # Support CSV or Excel based on file extension
    suffix = data_path.suffix.lower()
    if suffix == ".xlsx":
        df = pd.read_excel(data_path, engine="openpyxl")
    elif suffix == ".csv":
        df = pd.read_csv(data_path)
    # else block removed to fix syntax error
    else:
        df = pd.read_csv(data_path)

    # Use columns from records.xls
    required_columns = {
        "funding_total_usd",
        "funding_rounds",
        "founded_at",
        "status",
    }
    missing = required_columns - set(df.columns)
    if missing:
        raise ValueError(f"CSV/Excel is missing required columns: {sorted(list(missing))}")

    X = np.vstack(df.apply(preprocess_row, axis=1).values)

    # Map status to 1/0 (operating = 1, others = 0)
    y_raw = df["status"].astype(str).str.strip().values
    y = np.array([1 if v.lower() == "operating" else 0 for v in y_raw])

    return X, y


def train_model(X: np.ndarray, y: np.ndarray) -> tuple[RandomForestClassifier, dict]:
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
        class_weight="balanced",
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "roc_auc": float(roc_auc_score(y_test, y_proba)),
        "report": classification_report(y_test, y_pred, output_dict=True),
    }
    return model, metrics


def main():
    parser = argparse.ArgumentParser(description="Train startup success/failure model from records.xls")
    parser.add_argument("--csv", required=True, help="Path to training data (.csv or .xlsx)")
    parser.add_argument("--out_model", default=str(Path(__file__).parent.parent / "models" / "startup_model.pkl"), help="Path to save trained model .pkl")
    parser.add_argument("--metrics", default="train_metrics.json", help="Where to write evaluation metrics JSON")
    args = parser.parse_args()

    csv_path = Path(args.csv)
    out_model_path = Path(args.out_model)
    out_model_path.parent.mkdir(parents=True, exist_ok=True)

    X, y = load_data(csv_path, label_column=None)

    model, metrics = train_model(X, y)

    # Persist model only
    with open(out_model_path, "wb") as f:
        pickle.dump(model, f)

    with open(args.metrics, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    print("Saved model to:", out_model_path)
    print("Metrics:\n", json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()


