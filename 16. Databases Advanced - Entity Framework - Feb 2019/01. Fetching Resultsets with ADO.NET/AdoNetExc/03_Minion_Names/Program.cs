﻿namespace _03_Minion_Names
{
    using Configuration;
    using System;
    using System.Data.SqlClient;

    public class Program
    {
        public static void Main()
        {
            int id = int.Parse(Console.ReadLine());

            using (SqlConnection connection = new SqlConnection(Connection.ConnectionStringWithDatabase))
            {
                connection.Open();

                string villainNameQuery = @"SELECT Name FROM Villains WHERE Id = @Id";

                using (SqlCommand command = new SqlCommand(villainNameQuery, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    string villainName = (string)command.ExecuteScalar();

                    if (villainName == null)
                    {
                        Console.WriteLine($"No villain with ID {id} exists in database.");
                        return;
                    }

                    Console.WriteLine($"Villain: {villainName}");
                }

                string minionsQuery = @"SELECT ROW_NUMBER() OVER (ORDER BY m.Name) as RowNum,
                                         m.Name, 
                                         m.Age
                                    FROM MinionsVillains AS mv
                                    JOIN Minions As m ON mv.MinionId = m.Id
                                   WHERE mv.VillainId = @Id
                                ORDER BY m.Name";

                using (SqlCommand command = new SqlCommand(minionsQuery, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            long rowNumber = (long)reader[0];
                            string name = (string)reader[1];
                            int age = (int)reader[2];

                            Console.WriteLine($"{rowNumber}. {name} {age}");
                        }

                        if (reader.HasRows)
                        {
                            Console.WriteLine("(no minions)");
                        }
                    }
                }

            }
        }
    }
}
