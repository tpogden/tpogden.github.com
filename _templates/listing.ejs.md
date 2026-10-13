::: {.list .quarto-listing-default}

<% for (const item of items) { %>
::: {.quarto-post .image-left}

::: {.body}

<h3 class="no-anchor listing-title"><a href="<%- item.path %>" class="no-external"><%= item.title %></a><% if (item.recommended) { %> <span class="star" title="Recommended">★</span><% } %></h3>

:::

:::
<% } %>

:::
