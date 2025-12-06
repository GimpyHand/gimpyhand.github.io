(function themeController() {
	const storageKey = "wm-theme";
	const getStoredTheme = () => localStorage.getItem(storageKey);
	const getPreferredTheme = () => {
		const stored = getStoredTheme();
		if (stored) return stored;
		return "auto";
	};
	const setTheme = (theme) => {
		if (theme === "auto") {
			const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			document.documentElement.setAttribute(
				"data-bs-theme",
				isDark ? "dark" : "light",
			);
		} else {
			document.documentElement.setAttribute("data-bs-theme", theme);
		}
	};
	setTheme(getPreferredTheme());
	window
		.matchMedia("(prefers-color-scheme: dark)")
		.addEventListener("change", () => {
			if (getStoredTheme() === "auto" || !getStoredTheme()) {
				setTheme("auto");
			}
		});
	document.querySelectorAll(".wm-theme-option").forEach((btn) => {
		btn.addEventListener("click", () => {
			const val = btn.getAttribute("data-theme-value");
			localStorage.setItem(storageKey, val);
			setTheme(val);
		});
	});
})();

const accountNumber = "621000987385";
const eyeBtn = document.getElementById("wm-toggle-acct-no");
const accountNoText = document.getElementById("wm-account-no-text");
let accountNoVisible = false;
if (eyeBtn && accountNoText) {
	eyeBtn.addEventListener("click", () => {
		eyeBtn.classList.toggle("fa-eye");
		eyeBtn.classList.toggle("fa-eye-slash");
		accountNoVisible = !accountNoVisible;
		accountNoText.innerText = accountNoVisible
			? accountNumber
			: `*********${accountNumber.slice(-3)}`;
	});
}

let balance = 2579.63;
const balanceNode = document.getElementById("wm-account-balance");
if (balanceNode) {
	balanceNode.innerText = `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
const transactionList = document.getElementById("wm-transaction-list");
const depositList = document.getElementById("wm-deposit-list");

function deposit() {
	const amountToDepositNode = document.getElementById("wm-amount-in");
	const amountToDeposit = Number(amountToDepositNode.value);
	amountToDepositNode.value = "";
	balance += amountToDeposit;
	if (balanceNode) {
		balanceNode.innerText = `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	}

	const listGroupItem = document.createElement("a");
	listGroupItem.classList.add("list-group-item", "list-group-item-action");

	const topPart = document.createElement("div");
	topPart.classList.add("d-flex", "w-100", "justify-content-between");

	const h5 = document.createElement("h5");
	h5.classList.add("mb-1");
	h5.innerText = "Deposit";
	const amount = document.createElement("div");
	amount.classList.add("fs-5", "text-success");
	amount.innerText = `+$${amountToDeposit.toFixed(2)}`;

	topPart.append(h5, amount);

	const middlePart = document.createElement("p");
	middlePart.classList.add("mb-1");
	middlePart.innerText = "Transfer In (CREDIT)";

	const lastPart = document.createElement("div");
	lastPart.classList.add("d-flex", "w-100", "justify-content-between");

	const small1 = document.createElement("small");
	const now = new Date();
	small1.innerText = now.toLocaleString();
	const small2 = document.createElement("small");
	small2.innerText = `Updated balance: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
	lastPart.append(small1, small2);

	listGroupItem.append(topPart, middlePart, lastPart);

 const existingList = transactionList.innerHTML;
 transactionList.innerHTML = "";
 transactionList.append(listGroupItem);
 transactionList.innerHTML += existingList;

 if (depositList) {
     const clone = listGroupItem.cloneNode(true);
     const existingDepositList = depositList.innerHTML;
     depositList.innerHTML = "";
     depositList.append(clone);
     depositList.innerHTML += existingDepositList;
 }

	const alertNode = document.getElementById("wm-deposit-alert");
	if (alertNode) {
		alertNode.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
          Deposit successful!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
	}
}

function sendMoney() {
    const amountToTransfer = Number(
        document.getElementById("wm-amount-out").value,
    );
    const transferType = document.getElementById("wm-transfer-type").value;
    const beneficiaryName = document.getElementById("wm-beneficiary-name").value;
    const sendMoneyForm = document.getElementById("wm-send-form");

    if (!isFinite(amountToTransfer) || amountToTransfer <= 0) {
        const alertNode = document.getElementById("wm-transfer-alert");
        if (alertNode) {
            alertNode.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert" >
              Please enter a valid amount greater than 0.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `;
        }
        if (sendMoneyForm) sendMoneyForm.reset();
        return;
    }

    if (amountToTransfer > balance) {
        const listGroupItem = document.createElement("a");
        listGroupItem.classList.add("list-group-item", "list-group-item-action");

        const topPart = document.createElement("div");
        topPart.classList.add("d-flex", "w-100", "justify-content-between");

        const h5 = document.createElement("h5");
        h5.classList.add("mb-1");
        h5.innerText = `${transferType} Transfer: ${beneficiaryName}`;
        const badge = document.createElement("span");
        badge.classList.add("badge", "text-bg-danger", "ms-2");
        badge.innerText = "Terminated";
        h5.appendChild(badge);

        const amount = document.createElement("div");
        amount.classList.add("fs-5", "wm-amount-neg");
        amount.innerText = `-$${amountToTransfer.toFixed(2)}`;

        topPart.append(h5, amount);

        const middlePart = document.createElement("p");
        middlePart.classList.add("mb-1");
        middlePart.innerText = "Transfer Out (DEBIT) — Insufficient funds";

        const lastPart = document.createElement("div");
        lastPart.classList.add("d-flex", "w-100", "justify-content-between");

        const small1 = document.createElement("small");
        const now = new Date();
        small1.innerText = now.toLocaleString();
        const small2 = document.createElement("small");
        small2.innerText = `Updated balance: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (unchanged)`;
        lastPart.append(small1, small2);

        listGroupItem.append(topPart, middlePart, lastPart);

        const existingList = transactionList.innerHTML;
        transactionList.innerHTML = "";
        transactionList.append(listGroupItem);
        transactionList.innerHTML += existingList;

        const alertNode = document.getElementById("wm-transfer-alert");
        if (alertNode) {
            alertNode.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show mt-3" role="alert" >
              Insufficient funds. Transfer terminated.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          `;
        }

        if (sendMoneyForm) sendMoneyForm.reset();
        return;
    }

    balance -= amountToTransfer;
    if (balanceNode) {
        balanceNode.innerText = `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const listGroupItem = document.createElement("a");
    listGroupItem.classList.add("list-group-item", "list-group-item-action");

    const topPart = document.createElement("div");
    topPart.classList.add("d-flex", "w-100", "justify-content-between");

    const h5 = document.createElement("h5");
    h5.classList.add("mb-1");
    h5.innerText = `${transferType} Transfer: ${beneficiaryName}`;
    const amount = document.createElement("div");
    amount.classList.add("fs-5", "wm-amount-neg");
    amount.innerText = `-$${amountToTransfer.toFixed(2)}`;

    topPart.append(h5, amount);

    const middlePart = document.createElement("p");
    middlePart.classList.add("mb-1");
    middlePart.innerText = "Transfer Out (DEBIT)";

    const lastPart = document.createElement("div");
    lastPart.classList.add("d-flex", "w-100", "justify-content-between");

    const small1 = document.createElement("small");
    const now = new Date();
    small1.innerText = now.toLocaleString();
    const small2 = document.createElement("small");
    small2.innerText = `Updated balance: $${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    lastPart.append(small1, small2);

    listGroupItem.append(topPart, middlePart, lastPart);

    const existingList = transactionList.innerHTML;
    transactionList.innerHTML = "";
    transactionList.append(listGroupItem);
    transactionList.innerHTML += existingList;

    const alertNode = document.getElementById("wm-transfer-alert");
    if (alertNode) {
        alertNode.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-3" role="alert" >
          Transfer successful!
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    }

    if (sendMoneyForm) sendMoneyForm.reset();
}
