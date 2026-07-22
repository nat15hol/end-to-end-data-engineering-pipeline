from connection import get_connection


def main():
    conn = get_connection()

    with open("src/database/schema.sql", "r") as file:
        sql = file.read()

    cursor = conn.cursor()
    cursor.execute(sql)

    conn.commit()

    cursor.close()
    conn.close()

    print("Tables created successfully")


if __name__ == "__main__":
    main()