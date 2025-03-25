# Starting point to the application
def main():
    food = SX_VEND2000_CLASS()
    SX_VEND2000_CLASS.MachineCicle(0)


# This is a vending machine. It will display the commands and reads from the input
class SX_VEND2000_CLASS:
    amount = 0
    list = [
        Store_class(store="coke", x=5),
        Store_class(store="fanta", x=3),
        Store_class(store="chips", x=4),
        Store_class(store="snickers", x=5),
    ]

    @staticmethod
    def MachineCicle(a):
        while True:
            print("\n\nAvailable commands:")
            print("prices                                   - Show prices of items")
            print(
                "insert (money)                           - Money put into money slot"
            )
            print(
                "order (coke, fanta, chips, snickers)     - Order from machines buttons"
            )
            print("app order (coke, fanta, chips, snickers) - Order+pay in mobile app")
            print("recall                                   - Gives money back")
            print("-------")
            print(f"Inserted money: {SX_VEND2000_CLASS.amount}")
            print("-------\n\n")

            machine = input()

            if machine.startswith("insert"):
                # Add to credit
                SX_VEND2000_CLASS.amount += int(machine.split(" ")[1])
                print(f"Adding {int(machine.split(' ')[1])} to credit")

            if machine.startswith("order"):
                # split string on space
                x = machine.split(" ")[1]
                # Find out witch kind
                if x == "coke":
                    # coke order
                    if (
                        SX_VEND2000_CLASS.list[0].store == x
                        and SX_VEND2000_CLASS.amount > 19
                        and SX_VEND2000_CLASS.list[0].x > 0
                    ):
                        print("Giving coke out")
                        SX_VEND2000_CLASS.amount -= 20
                        print(f"Giving {SX_VEND2000_CLASS.amount} out in change")
                        SX_VEND2000_CLASS.amount = 0
                        SX_VEND2000_CLASS.list[0].x -= 1
                    elif (
                        SX_VEND2000_CLASS.list[0].store == x
                        and SX_VEND2000_CLASS.list[0].x == 0
                    ):
                        print("No coke left")
                    elif SX_VEND2000_CLASS.list[0].store == x:
                        print(f"Need {20 - SX_VEND2000_CLASS.amount} more")

                elif x == "chips":
                    # chips order
                    if (
                        SX_VEND2000_CLASS.list[2].store == x
                        and SX_VEND2000_CLASS.amount > 14
                        and SX_VEND2000_CLASS.list[2].x >= 0
                    ):
                        print("Giving chips out")
                        SX_VEND2000_CLASS.amount -= 15
                        print(f"Giving {SX_VEND2000_CLASS.amount} out in change")
                        SX_VEND2000_CLASS.amount = 0
                        SX_VEND2000_CLASS.list[2].x -= 1
                    elif (
                        SX_VEND2000_CLASS.list[2].store == x
                        and SX_VEND2000_CLASS.list[2].x == 0
                    ):
                        print("No chips left")
                    elif SX_VEND2000_CLASS.list[2].store == x:
                        print(f"Need {15 - SX_VEND2000_CLASS.amount} more")

                elif x == "snickers":
                    # snickers order
                    if (
                        SX_VEND2000_CLASS.list[3].store == x
                        and SX_VEND2000_CLASS.amount > 9
                        and SX_VEND2000_CLASS.list[3].x > 0
                    ):
                        print("Giving snickers out")
                        SX_VEND2000_CLASS.amount -= 15
                        print(f"Giving {SX_VEND2000_CLASS.amount} out in change")
                        SX_VEND2000_CLASS.amount = 0
                        SX_VEND2000_CLASS.list[3].x -= 1
                    elif (
                        SX_VEND2000_CLASS.list[3].store == x
                        and SX_VEND2000_CLASS.list[3].x == 0
                    ):
                        print("No snickers left")
                    elif SX_VEND2000_CLASS.list[3].store == x:
                        print(f"Need {10 - SX_VEND2000_CLASS.amount} more")

                elif x == "fanta":
                    # fanta order
                    if (
                        SX_VEND2000_CLASS.list[1].store == x
                        and SX_VEND2000_CLASS.amount > 14
                        and SX_VEND2000_CLASS.list[1].x > 0
                    ):
                        print("Giving fanta out")
                        SX_VEND2000_CLASS.amount -= 15
                        print(f"Giving {SX_VEND2000_CLASS.amount} out in change")
                        SX_VEND2000_CLASS.amount = 0
                        SX_VEND2000_CLASS.list[1].x -= 1
                    elif (
                        SX_VEND2000_CLASS.list[1].store == x
                        and SX_VEND2000_CLASS.list[1].x == 0
                    ):
                        print("No fanta left")
                    elif SX_VEND2000_CLASS.list[1].store == x:
                        print(f"Need {15 - SX_VEND2000_CLASS.amount} more")

                else:
                    # why???????????
                    print("No such element")

            if machine.startswith("app order"):
                # split string on space
                x = machine.split(" ")[2]
                # Find out witch kind
                if x == "coke":
                    # coke app order
                    if SX_VEND2000_CLASS.list[0].x > 0:
                        print("Giving coke out")
                        SX_VEND2000_CLASS.list[0].x -= 1
                    else:
                        print("No coke left")

                elif x == "chips":
                    # chips app order
                    if SX_VEND2000_CLASS.list[2].x > 0:
                        print("Giving chips out")
                        SX_VEND2000_CLASS.list[2].x -= 1
                    else:
                        print("No chips left")

                elif x == "snickers":
                    # snickers app order
                    if SX_VEND2000_CLASS.list[3].x > 0:
                        print("Giving snickers out")
                        SX_VEND2000_CLASS.list[3].x -= 1
                    else:
                        print("No snickers left")

                elif x == "fanta":
                    # fanta app order
                    if SX_VEND2000_CLASS.list[1].x > 0:
                        print("Giving fanta out")
                        SX_VEND2000_CLASS.list[1].x -= 1
                    else:
                        print("No fanta left")

            if machine == "recall":
                # Give amount back
                print(f"Returning {SX_VEND2000_CLASS.amount} to customer")
                SX_VEND2000_CLASS.amount = 0

            if machine == "prices":
                print("coke = 20")
                print("fanta = 15")
                print("chips = 15")
                print("snickers = 10")

            # Console.WriteLine("\n\n!!!!!!!!!--------\nRemaining amount after this turn:");
            # Console.WriteLine("coke {0}", list[0].x);
            # Console.WriteLine("fanta {0}", list[1].x);
            # Console.WriteLine("chips {0}", list[2].x);
            # Console.WriteLine("snickers {0}", list[3].x);


class Store_class:
    def __init__(self, store=None, x=0, money=0.0):
        self.store = store
        self.x = x
        self.money = money


if __name__ == "__main__":
    main()
