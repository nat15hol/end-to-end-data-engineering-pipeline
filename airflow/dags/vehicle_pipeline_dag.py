from airflow import DAG
from airflow.operators.bash import BashOperator

from datetime import datetime


with DAG(
    dag_id="vehicle_pipeline",
    start_date=datetime(2026, 7, 23),
    schedule="@hourly",
    catchup=False,
) as dag:

    ingestion = BashOperator(
        task_id="run_ingestion",
        bash_command="cd /opt/airflow/project && python -m src.ingestion.main",
    )

    dbt_run = BashOperator(
        task_id="dbt_run",
        bash_command="cd /opt/airflow/project/dbt && dbt run --profiles-dir .",
    )

    dbt_test = BashOperator(
        task_id="dbt_test",
        bash_command="cd /opt/airflow/project/dbt && dbt test --profiles-dir .",
    )

    ingestion >> dbt_run >> dbt_test