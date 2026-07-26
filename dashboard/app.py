import streamlit as st
import pandas as pd
from sqlalchemy import create_engine


st.set_page_config(
    page_title="Fleet Intelligence Center",
    layout="wide"
)


st.title("🚍 Skånetrafiken Fleet Intelligence Center")


engine = create_engine(
    "postgresql://postgres:postgres@localhost:5432/data_pipeline"
)


query = """
SELECT *
FROM fact_vehicle_latest_position
"""


try:
    df = pd.read_sql(query, engine)

    st.success("Connected to database ✅")


    col1, col2, col3 = st.columns(3)


    with col1:
        st.metric(
            "Aktiva fordon",
            len(df)
        )


    with col2:
        st.metric(
            "Medelhastighet",
            f"{df['speed'].mean():.1f} km/h"
        )


    with col3:
        st.metric(
            "Senaste positioner",
            len(df)
        )


    st.subheader("🗺️ Fordonskarta")


    map_df = df.rename(
        columns={
            "latitude": "lat",
            "longitude": "lon"
        }
    )


    st.map(map_df)


    st.subheader("Fordonsdata")

    st.dataframe(df)


except Exception as e:
    st.error(f"Database error: {e}")