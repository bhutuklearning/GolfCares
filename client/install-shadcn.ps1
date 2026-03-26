$components = "button", "card", "badge", "input", "label", "select", "dialog", "alert", "tabs", "progress", "toast", "separator", "avatar", "skeleton", "table", "dropdown-menu", "sheet"
foreach ($comp in $components) {
    Write-Host "Installing $comp..."
    npx shadcn@latest add $comp -y --overwrite
}
