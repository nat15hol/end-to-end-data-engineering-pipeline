from connection import get_connection


def main():
    conn = get_connection()

    print("Database connection successful")

    conn.close()


if __name__ == "__main__":
    main()