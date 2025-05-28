export const initializeMockGroups = () => {
  if (!localStorage.getItem('groups')) {
    localStorage.setItem('groups', JSON.stringify([
      {
        _id: "1a2b3c",
        name: "Family Expenses",
        shortId: "FAMILY",
        members: ["user@example.com", "mom@example.com"],
        expenses: [
          {
            title: "Groceries",
            amount: 120,
            paidBy: "user@example.com",
            splitBetween: ["user@example.com", "mom@example.com"],
            date: "2024-03-15T12:00:00Z"
          }
        ],
        createdAt: "2024-03-01T09:00:00Z"
      }
    ]))
  }
}