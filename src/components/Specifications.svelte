<div class="specification">
    {#each ['Трансмиссия','Аккумулятор', 'Двигатель','Хар-каN', 'Хар-каN+1', 'Хар-каN+2'] as details}
    <label class="pure-checkbox">
        {details}<input type="checkbox" value="" />
    </label>
                {/each}
</div>




<style>
.specification{
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 170px;
    background: #FFF;
    border-radius: 10px;
    font-size: 15px;
    box-shadow: 8px 4px 20px 1px #094e9439;
    height: fit-content;
    gap: 22px;
    padding-top: 30px;
    padding-bottom: 30px;
}
.pure-checkbox{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 15px;
    padding-right: 14px;
}

</style>