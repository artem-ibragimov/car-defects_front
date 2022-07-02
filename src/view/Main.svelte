<script>
import Specifications from "../components/Specifications.svelte";
import Brand from "../components/Brand.svelte";

import Chart from "../components/Chart.svelte";

</script>
<div class="main">
    <h1>Статистика дефектов по моделям 
    </h1>
    <div class="flex-row">
        <Brand/>
        <Chart/>
        <Specifications/>
    </div>
</div>


<style>
    .main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .main h1{
    font-size: 35px;
    letter-spacing: 0,3em;
    padding-top: 100px;
    font-weight: 300;
    }
    .flex-row{
        display: flex;
        flex-direction: row;
        margin-top: 50px;
        gap: 30px;
    }
</style>